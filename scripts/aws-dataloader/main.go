package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sort"
	"strings"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/ec2"
	"github.com/aws/aws-sdk-go-v2/service/pricing"
	"github.com/aws/aws-sdk-go-v2/service/pricing/types"
)

const (
	maxRetry  = 100
	baseDelay = time.Second
	maxDelay  = 5 * time.Minute
)

var fieldsToInclude = []string{
	"instanceType",
	"vcpu",
	"memory",
	"gpuMemory",
	"storage",
	"instanceFamily",
	"operatingSystem",
	"marketOption",
	"tenancy",
	"currentGeneration",
	"networkPerformance",
	"physicalProcessor",
	"processorArchitecture",
	"processorFeatures",
	"regionCode",
}

func main() {
	var (
		service      = flag.String("s", "", "Service code to fetch prices for (required)")
		serviceAlt   = flag.String("service", "", "Service code to fetch prices for (required)")
		region       = flag.String("r", "us-east-1", "AWS region to filter by")
		regionAlt    = flag.String("region", "us-east-1", "AWS region to filter by")
		listServices = flag.Bool("list-services", false, "List all available services")
		listRegions  = flag.Bool("list-regions", false, "List all available regions")
	)
	flag.Parse()

	ctx := context.TODO()

	cfg, err := config.LoadDefaultConfig(ctx)
	if err != nil {
		log.Fatal(err)
	}

	client := pricing.NewFromConfig(cfg)

	if *listServices {
		listAllServices(ctx, client)
		return
	}

	if *listRegions {
		listAllRegions(ctx, cfg)
		return
	}

	svc := *service
	if svc == "" {
		svc = *serviceAlt
	}
	if svc == "" {
		log.Fatal("Service code is required. Use -s or --service flag. Use --list-services to see available services.")
	}

	reg := *region
	if reg == "" {
		reg = *regionAlt
	}
	if reg == "" {
		reg = "us-east-1"
	}

	if reg == "all" {
		reg = ""
	}

	fetchPrices(ctx, client, svc, reg)
}

func listAllServices(ctx context.Context, client *pricing.Client) {
	allServices := []string{}
	nextToken := aws.String("")
	backoffDelay := baseDelay

	for {
		input := &pricing.DescribeServicesInput{
			FormatVersion: aws.String("aws_v1"),
			MaxResults:    aws.Int32(100),
		}

		if nextToken != nil && *nextToken != "" {
			input.NextToken = nextToken
		}

		var resp *pricing.DescribeServicesOutput
		var err error
		retryCount := 0

		for retryCount < maxRetry {
			resp, err = client.DescribeServices(ctx, input)
			if err == nil {
				backoffDelay = baseDelay
				break
			}

			retryCount++
			if retryCount >= maxRetry {
				log.Fatalf("Failed after %d retries: %v", maxRetry, err)
			}

			delay := backoffDelay
			if delay > maxDelay {
				delay = maxDelay
			}

			log.Printf("Request failed (attempt %d/%d): %v. Retrying in %v...", retryCount, maxRetry, err, delay)
			time.Sleep(delay)
			backoffDelay *= 2
		}

		for _, service := range resp.Services {
			allServices = append(allServices, *service.ServiceCode)
		}

		if resp.NextToken == nil || *resp.NextToken == "" {
			break
		}

		nextToken = resp.NextToken
		backoffDelay = baseDelay
	}

	sort.Strings(allServices)
	for _, svc := range allServices {
		fmt.Println(svc)
	}
}

func listAllRegions(ctx context.Context, cfg aws.Config) {
	ec2Client := ec2.NewFromConfig(cfg, func(o *ec2.Options) {
		o.Region = "us-east-1"
	})

	input := &ec2.DescribeRegionsInput{
		AllRegions: aws.Bool(true),
	}

	var resp *ec2.DescribeRegionsOutput
	var err error
	retryCount := 0
	backoffDelay := baseDelay

	for retryCount < maxRetry {
		resp, err = ec2Client.DescribeRegions(ctx, input)
		if err == nil {
			break
		}

		retryCount++
		if retryCount >= maxRetry {
			log.Fatalf("Failed after %d retries: %v", maxRetry, err)
		}

		delay := backoffDelay
		if delay > maxDelay {
			delay = maxDelay
		}

		log.Printf("Request failed (attempt %d/%d): %v. Retrying in %v...", retryCount, maxRetry, err, delay)
		time.Sleep(delay)
		backoffDelay *= 2
	}

	regions := make([]string, 0, len(resp.Regions))
	for _, region := range resp.Regions {
		regions = append(regions, *region.RegionName)
	}
	sort.Strings(regions)

	for _, reg := range regions {
		fmt.Println(reg)
	}
}

func fetchPrices(ctx context.Context, client *pricing.Client, serviceCode, region string) {
	allProducts := []map[string]interface{}{}
	nextToken := aws.String("")
	backoffDelay := baseDelay

	for {
		input := &pricing.GetProductsInput{
			ServiceCode:   aws.String(serviceCode),
			FormatVersion: aws.String("aws_v1"),
			MaxResults:    aws.Int32(100),
		}

		input.Filters = []types.Filter{
			{
				Field: aws.String("regionCode"),
				Type:  types.FilterTypeTermMatch,
				Value: aws.String(region),
			},
			{
				Field: aws.String("vpcnetworkingsupport"),
				Type:  types.FilterTypeTermMatch,
				Value: aws.String("true"),
			},
		}

		if nextToken != nil && *nextToken != "" {
			input.NextToken = nextToken
		}

		var resp *pricing.GetProductsOutput
		var err error
		retryCount := 0

		for retryCount < maxRetry {
			resp, err = client.GetProducts(ctx, input)
			if err == nil {
				backoffDelay = baseDelay
				break
			}

			retryCount++
			if retryCount >= maxRetry {
				log.Fatalf("Failed after %d retries: %v", maxRetry, err)
			}

			delay := backoffDelay
			if delay > maxDelay {
				delay = maxDelay
			}

			log.Printf("Request failed (attempt %d/%d): %v. Retrying in %v...", retryCount, maxRetry, err, delay)
			time.Sleep(delay)
			backoffDelay *= 2
		}

		for _, product := range resp.PriceList {
			var productMap map[string]interface{}
			if err := json.Unmarshal([]byte(product), &productMap); err != nil {
				log.Printf("Error unmarshaling product: %v", err)
				continue
			}
			allProducts = append(allProducts, productMap)
		}

		log.Printf("Fetched %d products (total: %d)", len(resp.PriceList), len(allProducts))

		if resp.NextToken == nil || *resp.NextToken == "" {
			break
		}

		nextToken = resp.NextToken
		backoffDelay = baseDelay
	}

	outputDir := "prices"
	if err := os.MkdirAll(outputDir, 0755); err != nil {
		log.Fatalf("Failed to create output directory: %v", err)
	}

	outputPath := filepath.Join(outputDir, strings.ToLower(serviceCode)+".json")
	outputFile, err := os.Create(outputPath)
	if err != nil {
		log.Fatalf("Failed to create output file: %v", err)
	}
	defer outputFile.Close()

	encoder := json.NewEncoder(outputFile)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(allProducts); err != nil {
		log.Fatalf("Failed to write JSON: %v", err)
	}

	fmt.Printf("Successfully saved %d %s pricing products for %s to %s\n", len(allProducts), serviceCode, region, outputPath)
}

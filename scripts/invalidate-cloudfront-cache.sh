#!/bin/bash

set -e

if [ -f .env ]; then
  echo "Loading local .env values..."
  . .env
fi

echo "Creating CLoudFront invalidation..."
INVALIDATION_ID=$(aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*" \
  --query 'Invalidation.Id' \
  --output text)

if [ -z "$INVALIDATION_ID" ]; then
  echo "Error: Failed to create invalidation"
  exit 1
fi

echo "Invalidating CloudFront cache (ID: $INVALIDATION_ID)..."
aws cloudfront wait invalidation-completed \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --id "$INVALIDATION_ID"

echo "Invalidation complete!"

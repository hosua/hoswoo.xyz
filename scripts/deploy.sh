#!/bin/bash

set -e

if [ -f .env ]; then
  echo "Loading local .env values..."
  . .env
fi

BUILD_DIR="dist/"

if [ -d "$BUILD_DIR" ]; then
  echo "Configuring s3 bucket for static website hosting..."
  aws s3 website s3://"$BUCKET_NAME" \
    --index-document index.html \
    --error-document index.html
  echo "Clearing s3 bucket..."
  aws s3 rm s3://"$BUCKET_NAME" --recursive
  cd "$BUILD_DIR" || exit
  echo "Uploading new bucket files..."
  aws s3 cp . s3://"$BUCKET_NAME" --recursive
  echo "Invalidating CloudFront cache..."
  aws cloudfront create-invalidation --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" --paths "/*"
else
  echo "Error: dist folder not found. Run npm build first!"
fi

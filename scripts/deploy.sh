#!/bin/bash

set -e

if [ -f .env ]; then
  echo "Loading local .env values..."
  . .env
fi

BUILD_DIR="dist/"

S3_BUCKET_URI="s3://$BUCKET_NAME"

if [ -d "$BUILD_DIR" ]; then
  echo "Configuring s3 bucket for static website hosting..."
  aws s3 website s3://"$BUCKET_NAME" \
    --index-document index.html \
    --error-document index.html

  echo "Clearing s3 bucket..."
  aws s3 rm s3://"$BUCKET_NAME" --recursive
  pushd "$BUILD_DIR" || exit

  echo "Uploading new bucket files..."
  aws s3 cp . "$S3_BUCKET_URI" \
    --recursive \
    --exclude index.html
  aws s3 cp index.html "$S3_BUCKET_URI" --cache-control "no-cache"
else
  echo "Error: dist folder not found. Run npm build first!"
  exit 1
fi

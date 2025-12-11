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
  aws s3 website "$S3_BUCKET_URI" \
    --index-document index.html \
    --error-document index.html

  echo "Clearing frontend files from s3..."
  aws s3 rm "$S3_BUCKET_URI" \
    --recursive \
    --exclude "games/*"
  pushd "$BUILD_DIR" || exit

  echo "Uploading frontend files to s3..."
  aws s3 cp . "$S3_BUCKET_URI" \
    --recursive \
    --exclude index.html \
    --exclude "games/*"
  aws s3 cp index.html "$S3_BUCKET_URI" --cache-control "no-cache"
else
  echo "Error: dist folder not found. Run npm build first!"
  exit 1
fi

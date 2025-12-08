#!/bin/bash

if [ -f ../.env ]; then
  echo "Loading local .env values..."
  . ../.env
fi

BUILD_DIR="dist/"

if [ -d "$BUILD_DIR" ]; then
  echo "Configuring s3 bucket for static website hosting..."
  aws s3 website s3://"$BUCKET_NAME" --index-document index.html
  echo "Clearing s3 bucket..."
  aws s3 rm s3://"$BUCKET_NAME" --recursive
  cd "$BUILD_DIR" || exit
  echo "Uploading new bucket files..."
  aws s3 cp . s3://"$BUCKET_NAME" --recursive
else
  echo "Error: dist folder not found. Run npm build first!"
fi

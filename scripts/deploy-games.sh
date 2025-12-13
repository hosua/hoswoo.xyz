#!/bin/bash

set -e

if [ -f .env ]; then
  echo "Loading local .env values..."
  . .env
fi

GAMES_DIR="public/games"

S3_BUCKET_URI="s3://$BUCKET_NAME"

if [ -d "$GAMES_DIR" ]; then
  echo "Configuring s3 bucket for static website hosting..."
  aws s3 website "$S3_BUCKET_URI" \
    --index-document index.html \
    --error-document index.html

  echo "Clearing games from s3..."
  aws s3 rm "$S3_BUCKET_URI/games" \
    --recursive \
    --exclude "games/*"

  echo "Uploading games to s3..."
  aws s3 cp "$GAMES_DIR/" "$S3_BUCKET_URI/games" --recursive
else
  echo "Error: $GAMES_DIR folder not found. Run npm run build-games first!"
  exit 1
fi

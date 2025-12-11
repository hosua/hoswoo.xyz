#!/bin/bash

set -e

if [ -f .env ]; then
  echo "Loading local .env values..."
  . .env
fi

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
  --paths "/*" \
  --no-cli-pager

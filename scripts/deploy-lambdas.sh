#!/bin/bash

set -e

. .env

pushd lambdas || exit

zip url_shortener.zip url_shortener.mjs
zip get_url.zip get_url.mjs

echo "Uploading and publishing getUrl Lambda..."
aws lambda update-function-code \
  --function-name "$LAMBDA_GET_URL" \
  --zip-file fileb://get_url.zip \
  --no-cli-pager &&
  aws lambda wait function-updated \
    --function-name "$LAMBDA_GET_URL" &&
  aws lambda publish-version \
    --function-name "$LAMBDA_GET_URL" \
    --no-cli-pager

echo "Uploading and publishing urlShortener Lambda..."
aws lambda update-function-code \
  --function-name "$LAMBDA_URL_SHORTENER" \
  --zip-file fileb://url_shortener.zip \
  --no-cli-pager &&
  aws lambda wait function-updated \
    --function-name "$LAMBDA_URL_SHORTENER" &&
  aws lambda publish-version \
    --function-name "$LAMBDA_URL_SHORTENER" \
    --no-cli-pager

rm ./*.zip

#!/bin/bash

set -e

if [ -f ".env" ]; then
  . .env
fi

pushd lambdas || exit

# Deploy url shortener lambdas
pushd urlShortener || exit

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

popd

# Deploy ip visitor lambdas
pushd IPVisitorCounter || exit

echo "Uploading and publishing IP Vistor counter Lambda..."
zip ip_visitor.zip ip_visitor_counter.mjs
aws lambda update-function-code \
  --function-name "$LAMBDA_IP_VISITOR_COUNTER" \
  --zip-file fileb://ip_visitor.zip \
  --no-cli-pager &&
  aws lambda wait function-updated \
    --function-name "$LAMBDA_IP_VISITOR_COUNTER" &&
  aws lambda publish-version \
    --function-name "$LAMBDA_IP_VISITOR_COUNTER" \
    --no-cli-pager

rm ./*.zip
popd

pushd contactForm || exit
zip send_contact_email.zip send_contact_email.mjs
aws lambda update-function-code \
  --function-name "$LAMBDA_SEND_CONTACT_EMAIL" \
  --zip-file fileb://send_contact_email.zip \
  --no-cli-pager &&
  aws lambda wait function-updated \
    --function-name "$LAMBDA_SEND_CONTACT_EMAIL" &&
  aws lambda publish-version \
    --function-name "$LAMBDA_SEND_CONTACT_EMAIL" \
    --no-cli-pager

popd

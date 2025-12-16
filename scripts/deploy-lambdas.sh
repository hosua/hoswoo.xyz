#!/bin/bash

set -e

if [ -f ".env" ]; then
  . .env
fi

LAMBDA_GET_URL=getUrl
LAMBDA_URL_SHORTENER=urlShortener
LAMBDA_IP_VISITOR_COUNTER=ipVisitorCounter
LAMBDA_SEND_CONTACT_EMAIL=sendContactEmail
LAMBDA_RENAME_COGNITO_USER=renameCognitoUser

pushd lambdas || exit

# Deploy url shortener lambdas
pushd urlShortener || exit

zip url_shortener.zip url_shortener.mjs
zip get_url.zip get_url.mjs

echo "Uploading and get url Lambda..."
aws lambda update-function-code \
  --function-name "$LAMBDA_GET_URL" \
  --zip-file fileb://get_url.zip \
  --no-cli-pager

echo "Uploading url shortener Lambda..."
aws lambda update-function-code \
  --function-name "$LAMBDA_URL_SHORTENER" \
  --zip-file fileb://url_shortener.zip \
  --no-cli-pager

rm ./*.zip

popd

# Deploy ip visitor lambdas
pushd IPVisitorCounter || exit
echo "Uploading vistor counter Lambda..."
zip ip_visitor.zip ip_visitor_counter.mjs
aws lambda update-function-code \
  --function-name "$LAMBDA_IP_VISITOR_COUNTER" \
  --zip-file fileb://ip_visitor.zip \
  --no-cli-pager

rm ./*.zip
popd

pushd contactForm || exit
zip send_contact_email.zip send_contact_email.mjs
aws lambda update-function-code \
  --function-name "$LAMBDA_SEND_CONTACT_EMAIL" \
  --zip-file fileb://send_contact_email.zip \
  --no-cli-pager
rm ./*.zip
popd

pushd renameCognitoUser || exit
zip rename_cognito_username.zip rename_cognito_username.mjs
aws lambda update-function-code \
  --function-name "$LAMBDA_RENAME_COGNITO_USER" \
  --zip-file fileb://rename_cognito_username.zip \
  --no-cli-pager
rm ./*.zip
popd

echo "Publishing uploaded lambdas..."
aws lambda wait function-updated \
  --function-name "$LAMBDA_GET_URL" &&
  aws lambda publish-version \
    --function-name "$LAMBDA_GET_URL" \
    --no-cli-pager

aws lambda wait function-updated \
  --function-name "$LAMBDA_URL_SHORTENER" &&
  aws lambda publish-version \
    --function-name "$LAMBDA_URL_SHORTENER" \
    --no-cli-pager

aws lambda wait function-updated \
  --function-name "$LAMBDA_IP_VISITOR_COUNTER" &&
  aws lambda publish-version \
    --function-name "$LAMBDA_IP_VISITOR_COUNTER" \
    --no-cli-pager

aws lambda wait function-updated \
  --function-name "$LAMBDA_SEND_CONTACT_EMAIL" &&
  aws lambda publish-version \
    --function-name "$LAMBDA_SEND_CONTACT_EMAIL" \
    --no-cli-pager

aws lambda wait function-updated \
  --function-name "$LAMBDA_RENAME_COGNITO_USER" &&
  aws lambda publish-version \
    --function-name "$LAMBDA_RENAME_COGNITO_USER" \
    --no-cli-pager

echo "Finished uploading and publishing all lambdas!"

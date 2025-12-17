import {
  CognitoIdentityProviderClient,
  AdminUpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({});

const { user_pool_id } = process.env;

export const handler = async (event, context) => {
  const { originalUsername, newUsername } = JSON.parse(event.body || {});
  const cmd = new AdminUpdateUserAttributesCommand({
    UserPoolId: user_pool_id,
    Username: originalUsername,
    UserAttributes: [
      {
        Name: "preferred_username",
        Value: newUsername,
      },
    ],
  });
  return await cognitoClient.send(cmd);
};

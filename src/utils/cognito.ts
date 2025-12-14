export const getCognitoAuthConfig = () => {
  const requiredEnvVars = [
    "COGNITO_CLIENT_ID",
    "COGNITO_AUTH_URL",
    "COGNITO_LOGIN_URI",
    "COGNITO_LOGOUT_URI",
  ];

  console.log(process.env);

  return {
    authority: "",
    client_id: "770381dt1fu84dcmiflphmle3h",
    redirect_uri: "https://hoswoo.xyz",
    response_type: "code",
    scope: "phone openid email",
  };
};

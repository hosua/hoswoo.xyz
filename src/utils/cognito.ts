import { REGION, COGNITO } from "@src/lib/env";
import { isProd } from "@src/lib/env";

const getUserPoolId = () =>
  `https://cognito-idp.${REGION}.amazonaws.com/${REGION}_${COGNITO.ID}`;

const getUserPoolDomain = () =>
  COGNITO.CUSTOM_DOMAIN ||
  `${REGION}${COGNITO.ID}.auth.${REGION}.amazoncognito.com`;

const getClientId = () => COGNITO.CLIENT_ID;

const getCognitoAuthUrl = () =>
  `https://cognito-idp.${REGION}.amazonaws.com/${getUserPoolId()}`;

const getTokenSigningKeyUrl = () =>
  `https://cognito-idp.${REGION}.amazonaws.com/${getUserPoolId()}/.well-known/jwks.json`;

const getLoginURI = (): string =>
  isProd() ? COGNITO.LOGIN_URI : "http://localhost:5173";

const getLoginURL = (): string =>
  `https://${getUserPoolDomain()}/login?client_id=${getClientId()}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(getLoginURI())}`;

const getLogoutURI = (): string =>
  isProd() ? COGNITO.LOGOUT_URI : "http://localhost:5173";

const getLogoutURL = (): string =>
  `https://${getUserPoolDomain()}/logout?client_id=${getClientId()}&logout_uri=${encodeURIComponent(getLogoutURI())}`;

const getCognitoAuthConfig = () => {
  const requiredEnvVars = ["ID", "CLIENT_ID", "LOGIN_URI", "LOGOUT_URI"];

  for (const envVar of requiredEnvVars)
    if (!COGNITO[envVar])
      console.error(`Missing required cognito variable ${envVar}!`);

  return {
    authority: getCognitoAuthUrl(),
    client_id: COGNITO.CLIENT_ID,
    redirect_uri: COGNITO.LOGIN_URI,
    response_type: COGNITO.LOGOUT_URI,
    scope: "phone openid email",
  };
};

export {
  getUserPoolId,
  getUserPoolDomain,
  getCognitoAuthUrl,
  getClientId,
  getLoginURL,
  getLogoutURL,
  getTokenSigningKeyUrl,
  getCognitoAuthConfig,
};

import { REGION, COGNITO } from "@src/lib/env";
import { isProd } from "@src/lib/env";

const getUserPoolId = () => `${REGION}_${COGNITO.ID}`;

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

  const authority = getCognitoAuthUrl();
  const redirectUri = getLoginURI();

  return {
    authority,
    metadataUrl: `${authority}/.well-known/openid-configuration`,
    client_id: COGNITO.CLIENT_ID,
    redirect_uri: redirectUri,
    post_logout_redirect_uri: redirectUri, // Use same callback for both
    response_type: "code",
    scope: "phone openid email",
    automaticSilentRenew: true,
    loadUserInfo: false,
    // Use sessionStorage for state management (more reliable for OIDC flows)
    userStore: undefined, // Use default sessionStorage
    onSigninCallback: () => {
      // Clean up the URL after sign-in to prevent state mismatch on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    },
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

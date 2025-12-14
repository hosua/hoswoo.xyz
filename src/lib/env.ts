const metaEnv = import.meta.env;

export const API_BASE_URL = metaEnv.VITE_API_BASE_URL || "";

export const COGNITO: Record<string, string> = {
  ID: metaEnv.VITE_COGNITO_ID || "",
  CLIENT_ID: metaEnv.VITE_COGNITO_CLIENT_ID || "",
  CUSTOM_DOMAIN: metaEnv.VITE_COGNITO_CUSTOM_DOMAIN || "",
  LOGIN_URI: metaEnv.VITE_COGNITO_LOGIN_URI || "",
  LOGOUT_URI: metaEnv.VITE_COGNITO_LOGOUT_URI || "",
};

export const REGION = metaEnv.VITE_REGION || "";

export type ENV = "PROD" | "DEV";
export const getEnv = (): ENV => (metaEnv.PROD ? "PROD" : "DEV");
export const isProd = (): boolean => getEnv() === "PROD";

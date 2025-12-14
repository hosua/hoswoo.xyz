import * as oidc from "react-oidc-context";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import * as cognito from "./utils/cognito";

const cognitoConfig = cognito.getCognitoAuthConfig();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <oidc.AuthProvider {...cognitoConfig}>
      <App />
    </oidc.AuthProvider>
  </StrictMode>,
);

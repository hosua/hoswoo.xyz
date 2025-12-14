import { Link } from "react-router-dom";
import * as oidc from "react-oidc-context";
import ThemeSwitcher from "@components/ThemeSwitcher";
import { Button } from "@components/ui/button";
import * as cognito from "@utils/cognito";
import { isProd } from "@src/lib/env";

export const NavBar = () => {
  const auth = oidc.useAuth();

  const handleSignIn = async () => {
    try {
      await auth.signinRedirect();
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      // Clear the OIDC session
      await auth.removeUser();
      
      if (isProd()) {
        // In production, redirect to Cognito's logout endpoint
        // Note: Make sure the logout URI is in "Allowed sign-out URLs" in Cognito
        window.location.href = cognito.getLogoutURL();
      } else {
        // In local dev, just reload the page after clearing session
        // (Cognito logout requires the URI to be in allowed sign-out URLs)
        window.location.reload();
      }
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback: just reload the page
      window.location.reload();
    }
  };

  return (
    <nav className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="font-semibold h-9 inline-flex items-center -mt-1.25"
        >
          hoswoo.xyz
        </Link>
        <Button variant="ghost" asChild>
          <Link to="/">Games</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/url-shortener">URL Shortener</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link to="/contact">Contact</Link>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        {auth.isAuthenticated ? (
          <Button variant="outline" onClick={handleSignOut}>
            Sign Out
          </Button>
        ) : (
          <Button variant="outline" onClick={handleSignIn}>
            Sign In
          </Button>
        )}
        <ThemeSwitcher />
      </div>
    </nav>
  );
};

export default NavBar;

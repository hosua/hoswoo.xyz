import { Link, useNavigate, useLocation } from "react-router-dom";
import ThemeSwitcher from "@components/ThemeSwitcher";
import { Button } from "@components/ui/button";
import { useEffect } from "react";
import * as oidc from "react-oidc-context";
import * as cognito from "@utils/cognito";

export const NavBar = () => {
  const auth = oidc.useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getUsername = (): string => {
    if (!auth.user?.profile) return "user";
    const username = auth.user.profile["cognito:username"];
    return (
      (typeof username === "string" ? username : null) || "unknown username"
    );
  };

  const username = getUsername();
  const preferredUsername = auth.user?.profile?.["preferred_username"];

  useEffect(() => {
    if (
      auth.isAuthenticated &&
      username?.startsWith("google_") &&
      !preferredUsername &&
      location.pathname !== "/rename-user"
    ) {
      navigate("/rename-user");
    }
  }, [username, preferredUsername, auth.isAuthenticated, location.pathname, navigate]);

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
      // Redirect to Cognito's logout endpoint
      window.location.href = cognito.getLogoutURL();
    } catch (error) {
      // Fallback: just reload the page
      console.error("Sign out error:", error);
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
          <>
            <span className="text-sm text-muted-foreground">
              Signed in as: {username}
            </span>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </>
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

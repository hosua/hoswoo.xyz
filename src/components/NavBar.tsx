import { Link, useNavigate } from "react-router-dom";
import ThemeSwitcher from "@components/ThemeSwitcher";
import { Button } from "@components/ui/button";
import { useEffect } from "react";
import * as oidc from "react-oidc-context";
import * as cognito from "@utils/cognito";

export const NavBar = () => {
  const auth = oidc.useAuth();
  const navigate = useNavigate();

  const userProfile = auth.user?.profile;
  const realUsername = userProfile?.["cognito:username"];
  const preferredUsername = userProfile?.preferred_username || "";

  const getUsername = (): string => {
    if (!userProfile) return "";
    const username = preferredUsername || realUsername || "";
    return username as string;
  };

  const isGoogleUserNotRenamed =
    auth.isAuthenticated &&
    (realUsername as string)?.includes(preferredUsername);

  const displayUsername = getUsername();

  useEffect(() => {
    if (isGoogleUserNotRenamed) navigate("/rename-user");
  }, [isGoogleUserNotRenamed, navigate]);

  useEffect(() => {
    if (auth.error) {
      console.error("OIDC error from provider:", auth.error);
    }
  }, [auth.error]);

  const handleSignIn = async () => {
    try {
      await auth.signinRedirect();
    } catch (error) {
      console.error("Sign in error:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await auth.removeUser();
      window.location.href = cognito.getLogoutURL();
    } catch (error) {
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
              Signed in as: {displayUsername}
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

import { Link } from "react-router-dom";
import * as oidc from "react-oidc-context";
import ThemeSwitcher from "@components/ThemeSwitcher";
import { Button } from "@components/ui/button";
import * as cognito from "@utils/cognito";

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
      // Redirect to Cognito's logout endpoint
      window.location.href = cognito.getLogoutURL();
    } catch (error) {
      console.error("Sign out error:", error);
      // Fallback: just reload the page
      window.location.reload();
    }
  };

  // Extract username from user object
  const getUsername = () => {
    if (!auth.user) return null;
    // Cognito stores username in 'cognito:username' custom claim in the ID token
    // Check both profile and the ID token claims
    const profile = auth.user.profile || {};
    const idTokenClaims = (auth.user as any)?.id_token_claims || {};
    
    return (
      profile["cognito:username"] ||
      idTokenClaims["cognito:username"] ||
      profile.username ||
      profile.preferred_username ||
      idTokenClaims.preferred_username ||
      "User"
    );
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
              Signed in as: {getUsername()}
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

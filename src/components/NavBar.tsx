import { Link, useNavigate } from "react-router-dom";
import ThemeSwitcher from "@components/ThemeSwitcher";
import { Button } from "@components/ui/button";
import { useEffect, useState } from "react";
import * as oidc from "react-oidc-context";
import * as cognito from "@utils/cognito";
import { Menu } from "lucide-react";
import { useIsMobile } from "@hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@components/ui/sheet";

export const NavBar = () => {
  const auth = oidc.useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState<string | null>(null);

  const userProfile = auth.user?.profile;
  const realUsername = userProfile?.["cognito:username"] as string;
  const preferredUsername = userProfile?.preferred_username as string;

  const getUsername = (): string => {
    if (!userProfile) return "";
    const username = preferredUsername || realUsername || "";
    return username as string;
  };

  const isGoogleUserNotRenamed =
    auth.isAuthenticated &&
    realUsername?.startsWith("google_") &&
    !preferredUsername;

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

  const handleMobileNavClick = ({ path }: { path: string }) => {
    setClickedItem(path);
    setTimeout(() => {
      setMobileMenuOpen(false);
      setClickedItem(null);
    }, 250);
  };

  const navigationLinks = (
    <>
      <Button variant="ghost" asChild>
        <Link to="/">Games</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/url-shortener">URL Shortener</Link>
      </Button>
      <Button variant="ghost" asChild>
        <Link to="/contact">Contact</Link>
      </Button>
    </>
  );

  const mobileNavigationLinks = (
    <>
      <Button
        variant="ghost"
        asChild
        className={clickedItem === "/" ? "bg-accent" : ""}
      >
        <Link to="/" onClick={() => handleMobileNavClick({ path: "/" })}>
          Games
        </Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className={clickedItem === "/url-shortener" ? "bg-accent" : ""}
      >
        <Link
          to="/url-shortener"
          onClick={() => handleMobileNavClick({ path: "/url-shortener" })}
        >
          URL Shortener
        </Link>
      </Button>
      <Button
        variant="ghost"
        asChild
        className={clickedItem === "/contact" ? "bg-accent" : ""}
      >
        <Link
          to="/contact"
          onClick={() => handleMobileNavClick({ path: "/contact" })}
        >
          Contact
        </Link>
      </Button>
    </>
  );

  return (
    <nav className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-2">
        <Link
          to="/"
          className="font-semibold h-9 inline-flex items-center -mt-1.25"
        >
          hoswoo.xyz
        </Link>
        {!isMobile && navigationLinks}
        {isMobile && (
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 mt-4">
                {mobileNavigationLinks}
                <div className="border-t pt-4 mt-4">
                  {auth.isAuthenticated ? (
                    <>
                      <div className="text-sm text-muted-foreground mb-2 px-2">
                        Signed in as: {displayUsername}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          handleMobileNavClick({ path: "signout" });
                          handleSignOut();
                        }}
                        className={`w-full ${
                          clickedItem === "signout" ? "bg-accent" : ""
                        }`}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => {
                        handleMobileNavClick({ path: "signin" });
                        handleSignIn();
                      }}
                      className={`w-full ${
                        clickedItem === "signin" ? "bg-accent" : ""
                      }`}
                    >
                      Sign In
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
      {!isMobile && (
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
      )}
      {isMobile && (
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
        </div>
      )}
    </nav>
  );
};

export default NavBar;

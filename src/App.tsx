import { AuthProvider } from "react-oidc-context";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@components/theme-provider";
import { Toaster } from "@components/ui/sonner";
import NavBar from "@components/NavBar";
import { AppRoutes } from "./Routes";
import { useEffect } from "react";

import { publicIpv4 } from "public-ip";
import { countVisitor } from "@lib/ipVisitorCounter";
import { getWithTTL, setWithTTL } from "@lib/localStorageWithTTL";

import { VISITOR_COUNT_TTL } from "@utils/constants";

function App() {
  useEffect(() => {
    const countVisitorFn = async () => {
      const ip = await publicIpv4();
      if (!getWithTTL({ key: ip })) {
        countVisitor({ ip });
        setWithTTL({ key: ip, value: "visited", ttl: VISITOR_COUNT_TTL });
      }
    };
    countVisitorFn();
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <NavBar />
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import NavBar from "./components/NavBar";
import { AppRoutes } from "./Routes";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <BrowserRouter>
        <NavBar />
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

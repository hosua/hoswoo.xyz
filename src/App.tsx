import { ThemeProvider } from "@/components/theme-provider";
import GamesPage from "@/pages/GamesPage";
import ThemeSwitcher from "./components/ThemeSwitcher";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <ThemeSwitcher />
      <GamesPage />
    </ThemeProvider>
  );
}

export default App;

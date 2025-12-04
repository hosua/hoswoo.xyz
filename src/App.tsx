import { ThemeProvider } from "@/components/theme-provider";
import GamesPage from "@/pages/GamesPage";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <GamesPage />
    </ThemeProvider>
  );
}

export default App;

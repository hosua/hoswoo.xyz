import { Routes, Route } from "react-router-dom";
import GamesPage from "@pages/GamesPage";
import ShermieInvadersPage from "@pages/games/ShermieInvadersPage";
import SDL2PathfinderPage from "@pages/games/SDL2PathfinderPage";
import SnakePlusPlusPage from "@pages/games/SnakePlusPlusPage";
import FlappyBirdPage from "@pages/games/FlappyBirdPage";
import TetriPyPage from "@pages/games/TetriPyPage";
import UrlShortenerPage from "@pages/UrlShortenerPage";
import UrlRedirectPage from "@pages/UrlRedirectPage";
import ContactPage from "@pages/ContactPage";
import RenameUserPage from "@pages/RenameUserPage";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<GamesPage />} />
      <Route path="/games/shermie-invaders" element={<ShermieInvadersPage />} />
      <Route path="/games/sdl2-pathfinder" element={<SDL2PathfinderPage />} />
      <Route path="/games/snake-plus-plus" element={<SnakePlusPlusPage />} />
      <Route path="/games/flappy-bird" element={<FlappyBirdPage />} />
      <Route path="/games/tetripy" element={<TetriPyPage />} />
      <Route path="/url-shortener" element={<UrlShortenerPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/rename-user" element={<RenameUserPage />} />
      <Route path="/s/:shortUrl" element={<UrlRedirectPage />} />
    </Routes>
  );
};

import GamePage from "@components/GamePage";

export const SDL2PathfinderPage = () => {
  return (
    <GamePage
      title="SDL2 Pathfinder"
      description="Not really a game, but a cool pathfinder visualizer with a maze randomizer developed in SDL2/C++ and ported to WASM with emscripten."
      gameUrl="/games/sdl2-pathfinder/index.html"
      gameTitle="SDL2 Pathfinder"
    />
  );
};

export default SDL2PathfinderPage;

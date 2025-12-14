import { Gamepad2 } from "lucide-react";
import GameCard from "@components/GameCard";
export const GamesPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Gamepad2 size={40} />
          Games
        </h1>
        <p className="text-muted-foreground">
          This page showcases some of the games I've made for fun.
        </p>
        <p className="text-muted-foreground">
          Some are more polished than others, but I'm proud of them all.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GameCard
          to="/games/shermie-invaders"
          title="Shermie Invaders"
          description="A game developed in PhaserJS featuring Shermie, a brave sheep defending against tech enemies. Includes 150 levels, upgradable stats, and an exceptionally difficult boss rush mode. This game was made with love for my senior capstone project."
          githubUrl="https://github.com/hosua/shermie-invaders"
          languageIcon="javascript"
        />

        <GameCard
          to="/games/sdl2-pathfinder"
          title="SDL2 Pathfinder"
          description="Not really a game, but a cool pathfinder visualizer with a maze randomizer developed in SDL2/C++ and ported to WASM with emscripten."
          githubUrl="https://github.com/hosua/sdl2-pathfinder"
          languageIcon="cpp"
        />

        <GameCard
          to="/games/snake-plus-plus"
          title="Snake++"
          description="A Snake clone developed in... you guessed it! SDL and C++. It was ported over to wasm with emscripten. Sounds are disabled in the wasm build due to some annoying bugs I couldn't iron out."
          githubUrl="https://github.com/hosua/SnakePlusPlus"
          languageIcon="cpp"
        />

        <GameCard
          to="/games/flappy-bird"
          title="FlapPy Bird"
          description="A Flappy bird clone developed in Python and ported to wasm with pygbag. Note: hiscores currently don't work in the web version!"
          githubUrl="https://github.com/hosua/FlapPy-bird"
          languageIcon="python"
        />

        <GameCard
          to="/games/tetripy"
          title="TetriPy"
          description={
            <>
              <p className="text-muted-foreground text-sm">
                A Tetris clone written in pygame and ported to wasm with pygbag.
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Controls: Left/Right arrow keys to move, Z/X to rotate
                left/right, C to hold piece, P to pause, Space to hard drop.
              </p>
            </>
          }
          githubUrl="https://github.com/hosua/TetriPy"
          languageIcon="python"
        />
      </div>
    </div>
  );
};

export default GamesPage;

import GamePage from "@components/GamePage";

export const SnakePlusPlusPage = () => {
  return (
    <GamePage
      title="Snake++"
      description="A Snake clone developed in... you guessed it! SDL and C++. It was ported over to wasm with emscripten. Sounds are disabled in the wasm build due to some annoying bugs I couldn't iron out."
      gameUrl="/games/SnakePlusPlus/index.html"
      gameTitle="Snake++"
    />
  );
};

export default SnakePlusPlusPage;

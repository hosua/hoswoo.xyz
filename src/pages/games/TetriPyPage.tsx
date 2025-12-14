import GamePage from "@components/GamePage";

export const TetriPyPage = () => {
  return (
    <GamePage
      title="TetriPy"
      description={
        <>
          <p className="mb-2">
            A Tetris clone written in pygame and ported to wasm with pygbag.
          </p>
          <p>
            Controls: Left/Right arrow keys to move, Z/X to rotate left/right, C
            to hold piece, P to pause, Space to hard drop.
          </p>
        </>
      }
      gameUrl="/games/TetriPy/web/index.html"
      gameTitle="TetriPy"
    />
  );
};

export default TetriPyPage;

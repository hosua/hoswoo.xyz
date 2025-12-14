import GamePage from "@components/GamePage";

export const FlappyBirdPage = () => {
  return (
    <GamePage
      title="FlapPy Bird"
      description="A Flappy bird clone developed in Python and ported to wasm with pygbag. Note: hiscores currently don't work in the web version!"
      gameUrl="/games/FlapPy-bird/web/index.html"
      gameTitle="FlapPy Bird"
    />
  );
};

export default FlappyBirdPage;

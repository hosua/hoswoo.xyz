import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CustomIcon, { IconPreview } from "@/icons";

const GameCard = () => {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Cool Game</CardTitle>
        <CardDescription>
          This is a cool description of a cool game.
        </CardDescription>
        <CardAction>
          <Button>Play Now!</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <IconPreview />
      </CardContent>
      <CardFooter className="flex-col gap-2">Footer</CardFooter>
    </Card>
  );
};

export const GamesPage = () => {
  return (
    <>
      <GameCard />
    </>
  );
};

export default GamesPage;

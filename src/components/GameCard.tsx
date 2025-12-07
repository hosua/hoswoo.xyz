import { type ReactElement } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import CustomIcon, { type IconName } from "@/icons";

interface GameCardProps {
  to: string;
  title: string;
  description: string | ReactElement;
  githubUrl: string;
  languageIcon: IconName;
}

export const GameCard = ({
  to,
  title,
  description,
  githubUrl,
  languageIcon,
}: GameCardProps) => {
  return (
    <Card className="group relative overflow-hidden hover:shadow-lg transition-all hover:scale-105">
      <button
        type="button"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          window.open(githubUrl, "_blank", "noopener,noreferrer");
        }}
        className="absolute top-4 right-4 z-10 p-2 rounded-md hover:bg-accent transition-colors"
        aria-label={`View ${title} on GitHub`}
      >
        <CustomIcon name="github" width={22} height={22} />
      </button>
      {languageIcon && (
        <div className="absolute bottom-4 right-4 z-10">
          <CustomIcon name={languageIcon} width={32} height={32} />
        </div>
      )}
      <Link to={to} className="block h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {typeof description === "string" ? description : description}
          </CardDescription>
        </CardHeader>
        <CardFooter className="text-primary font-medium group-hover:underline">
          Play Now →
        </CardFooter>
      </Link>
    </Card>
  );
};

export default GameCard;

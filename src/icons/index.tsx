import { useTheme } from "@/components/theme-provider";

import { ReactComponent as GithubLightIcon } from "./github-light.svg";
import { ReactComponent as GithubDarkIcon } from "./github-dark.svg";
import { ReactComponent as CppIcon } from "./cpp.svg";
import { ReactComponent as PythonIcon } from "./python.svg";
import { ReactComponent as JavascriptIcon } from "./javascript.svg";

type IconName =
  | "github"
  | "cpp"
  | "c++"
  | "python"
  | "py"
  | "js"
  | "javascript";

interface CustomIconProps {
  name: IconName;
  width: number;
  height: number;
}

export const CustomIcon = ({ name, width, height }: CustomIconProps) => {
  const { theme } = useTheme();
  switch (name) {
    case "github":
      return theme === "dark" ? (
        <GithubDarkIcon width={width} height={height} />
      ) : (
        <GithubLightIcon width={width} height={height} />
      );
    case "cpp":
    case "c++":
      return <CppIcon width={width} height={height} />;
    case "python":
    case "py":
      return <PythonIcon width={width} height={height} />;
    case "javascript":
    case "js":
      return <JavascriptIcon width={width} height={height} />;
  }
};

export const IconPreview = ({ width = 32, height = 32 }) => {
  return (
    <>
      <CustomIcon name="github" width={width} height={height} />
      <CustomIcon name="cpp" width={width} height={height} />
      <CustomIcon name="py" width={width} height={height} />
      <CustomIcon name="js" width={width} height={height} />
    </>
  );
};

export default CustomIcon;

import Toggle, { Props as ToggleProps } from "./variants/Toggle";

interface Props extends ToggleProps {
  variant?: "toggle";
}

const DarkModeToggle: React.FC<Props> = ({ variant = "toggle", ...props }) => {
  return <Toggle {...props} />;
};

export default DarkModeToggle;

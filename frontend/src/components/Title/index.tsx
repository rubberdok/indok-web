import { TLink } from "@components/Breadcrumbs/types";
import { default as NormalTitle } from "./variants/Title";
import { default as AdminTitle } from "./variants/Admin";

type Props = {
  variant?: "normal" | "admin";
  title: string;
  breadcrumbs?: TLink[];
  children?: React.ReactNode;
};

const Title: React.FC<Props> = ({ variant = "normal", children, ...props }) => {
  if (variant === "normal") return <NormalTitle {...props}>{children}</NormalTitle>;
  if (variant === "admin") return <AdminTitle {...props}>{children}</AdminTitle>;
  return null;
};

export default Title;

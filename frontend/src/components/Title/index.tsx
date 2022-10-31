import { BaseTitle, Props as BaseProps } from "./variants/BaseTitle";

type Props = {
  variant?: "normal" | "dark";
  children?: React.ReactNode;
} & BaseProps;

export const Title: React.FC<React.PropsWithChildren<Props>> = ({ variant = "normal", children, ...props }) => {
  if (variant === "normal") return <BaseTitle {...props}>{children}</BaseTitle>;
  if (variant === "dark")
    return (
      <BaseTitle
        sx={{ backgroundColor: "grey.900", color: "common.white" }}
        {...props}
        BreadcrumbProps={{ onDark: true }}
      >
        {children}
      </BaseTitle>
    );
  return null;
};

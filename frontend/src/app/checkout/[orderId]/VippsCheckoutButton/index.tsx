import Script from "next/script";

type VippsCheckoutButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
  rounded?: boolean;
  stretched?: boolean;
  variant?: "primary" | "dark" | "light";
  language?: "no" | "en";
  branded?: boolean;
};

function VippsCheckoutButton({ onClick, ...props }: VippsCheckoutButtonProps) {
  const rounded = props.rounded ? "true" : "false";
  const stretched = props.stretched ? "true" : "false";
  const variant = props.variant || "primary";
  const language = props.language || "no";
  const branded = props.branded ? "true" : "false";
  const disabled = props.disabled ? "true" : undefined;
  return (
    <>
      <Script
        async
        type="text/javascript"
        src="https://checkout.vipps.no/checkout-button/v1/vipps-checkout-button.js"
      />
      <vipps-checkout-button
        rounded={rounded}
        stretched={stretched}
        variant={variant}
        language={language}
        branded={branded}
        disabled={disabled}
        onClick={onClick}
      />
    </>
  );
}

// Augment typescript to add the vipps-checkout-button element to the JSX namespace
declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "vipps-checkout-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        rounded: "true" | "false";
        stretched: "true" | "false";
        variant: "primary" | "dark" | "light";
        language: "no" | "en";
        branded: "true" | "false";
        disabled?: "true";
      };
    }
  }
}

export { VippsCheckoutButton };

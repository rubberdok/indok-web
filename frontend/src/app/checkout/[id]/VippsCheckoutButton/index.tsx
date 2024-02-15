import Script from "next/script";

type VippsCheckoutButtonProps = {
  onClick?: () => void;
};

function VippsCheckoutButton({ onClick }: VippsCheckoutButtonProps) {
  return (
    <>
      <Script
        async
        type="text/javascript"
        src="https://checkout.vipps.no/checkout-button/v1/vipps-checkout-button.js"
      />
      <vipps-checkout-button
        rounded="false"
        stretched="false"
        variant="orange"
        language="no"
        branded="true"
        onClick={onClick}
      />
    </>
  );
}

// Augment typescript to add the vipps-checkout-button element to the JSX namespace
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "vipps-checkout-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        rounded: "true" | "false";
        stretched: "true" | "false";
        variant: "orange" | "purple";
        language: "no" | "en";
        branded: "true" | "false";
      };
    }
  }
}

export { VippsCheckoutButton };

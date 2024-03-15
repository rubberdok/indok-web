import { NoSsr } from "@mui/material";

function Currency(props: { amount?: number }) {
  if (!props.amount) return null;
  return (
    <NoSsr fallback={props.amount}>
      {new Intl.NumberFormat("nb-NO", { style: "currency", currency: "NOK", maximumFractionDigits: 0 }).format(
        props.amount
      )}
    </NoSsr>
  );
}

export { Currency };

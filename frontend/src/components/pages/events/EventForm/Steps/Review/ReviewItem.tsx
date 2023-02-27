import { Typography } from "@mui/material";

type Props = {
  label: string;
  value: string | null | undefined | number | (() => string | null | undefined | number);
};

export const ReviewItem: React.FC<Props> = ({ label, value }) => {
  let displayValue: string | null | undefined | number;
  if (typeof value === "function") displayValue = value() || "-";
  else displayValue = value || "-";

  return (
    <>
      <Typography variant="subtitle2">{label}</Typography>
      <Typography>{displayValue}</Typography>
    </>
  );
};

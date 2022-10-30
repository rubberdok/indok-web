import { Typography } from "@mui/material";
import { FieldErrors, useFormContext } from "react-hook-form";

import { IEventForm } from "../schema";

type Props = {
  step: keyof FieldErrors<IEventForm>;
};

export const Errors: React.FC<Props> = ({ step }) => {
  const {
    formState: { errors },
  } = useFormContext<IEventForm>();

  if (step === "registration")
    return (
      <>
        {errors[step] &&
          Object.values(errors[step]?.details ?? {}).map((error) => {
            if (typeof error === "object" && "message" in error && error.message)
              return (
                <Typography key={error.message.toString()} variant="body1" color="error">
                  {error.message}
                </Typography>
              );
          })}
      </>
    );

  return (
    <>
      {errors[step] &&
        Object.values(errors[step] ?? {}).map((error) => {
          if (typeof error === "object" && "message" in error && error.message)
            return (
              <Typography key={error.message.toString()} variant="body1" color="error">
                {error.message}
              </Typography>
            );
        })}
    </>
  );
};

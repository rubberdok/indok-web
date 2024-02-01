import { useMutation, useQuery } from "@apollo/client";
import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { useState } from "react";

import { Link } from "@/components";
import { CarsDocument, UpdateCarDocument, UpdateCarInput } from "@/generated/graphql";

import { CarInfoForm } from "./CarInfoForm";

function useCars(): CarInfoForm | undefined {
  const { data } = useQuery(CarsDocument);
  const cars = data?.cars;
  const bjornen = cars?.find((car) => car.name === "Bjørnen");
  const oksen = cars?.find((car) => car.name === "Oksen");

  let values: CarInfoForm | undefined;
  if (bjornen) {
    values = {
      bjornen: {
        internalPrice: bjornen.internalPrice,
        internalPriceWeekend: bjornen.internalPriceWeekend,
        externalPrice: bjornen.externalPrice,
        externalPriceWeekend: bjornen.externalPriceWeekend,
        maxGuests: bjornen.maxGuests,
      },
    };
  }

  if (oksen) {
    values = {
      ...values,
      oksen: {
        internalPrice: oksen.internalPrice,
        internalPriceWeekend: oksen.internalPriceWeekend,
        externalPrice: oksen.externalPrice,
        externalPriceWeekend: oksen.externalPriceWeekend,
        maxGuests: oksen.maxGuests,
      },
    };
  }

  return values;
}

/** Component for editing car information. Only used on the admin page. */
export const CarInfoPicker: React.FC = () => {
  const [alert, setAlert] = useState<
    | {
        severity: "success" | "error";
        message: string | React.ReactNode;
      }
    | undefined
  >(undefined);

  const cars = useCars();
  const [updateCar] = useMutation(UpdateCarDocument, {
    onCompleted() {
      setAlert({
        severity: "success",
        message: "Informasjonen ble oppdatert.",
      });
    },
    onError() {
      setAlert({
        severity: "error",
        message: (
          <>
            <AlertTitle>Noe gikk galt, prøv igjen senere.</AlertTitle>
            Dersom problemet vedvarer, kontakt <Link href="mailto:kontakt@rubberdok.no">kontakt@rubberdok.no</Link>
          </>
        ),
      });
    },
  });

  function handleSubmit(data: CarInfoForm) {
    if (data.oksen) {
      const oksenData: UpdateCarInput = {
        name: "Oksen",
        internalPrice: data.oksen.internalPrice,
        internalPriceWeekend: data.oksen.internalPriceWeekend,
        externalPrice: data.oksen.externalPrice,
        externalPriceWeekend: data.oksen.externalPriceWeekend,
        maxGuests: data.oksen.maxGuests,
      };
      updateCar({ variables: { carData: oksenData } });
    }

    if (data.bjornen) {
      const bjornenData: UpdateCarInput = {
        name: "Bjørnen",
        internalPrice: data.bjornen.internalPrice,
        internalPriceWeekend: data.bjornen.internalPriceWeekend,
        externalPrice: data.bjornen.externalPrice,
        externalPriceWeekend: data.bjornen.externalPriceWeekend,
        maxGuests: data.bjornen.maxGuests,
      };

      updateCar({ variables: { carData: bjornenData } });
    }
  }

  return (
    <>
      <Snackbar open={Boolean(alert)} autoHideDuration={6000} onClose={() => setAlert(undefined)}>
        <Alert onClose={() => setAlert(undefined)} severity={alert?.severity}>
          {alert?.message}
        </Alert>
      </Snackbar>
      <CarInfoForm
        onSubmit={handleSubmit}
        values={cars}
        defaultValues={{
          oksen: {
            internalPrice: 1100,
            internalPriceWeekend: 1100,
            externalPrice: 3950,
            externalPriceWeekend: 5400,
            maxGuests: 18,
          },
          bjornen: {
            internalPrice: 1100,
            internalPriceWeekend: 1100,
            externalPrice: 3950,
            externalPriceWeekend: 5400,
            maxGuests: 18,
          },
        }}
      />
    </>
  );
};

import { useMutation, useQuery } from "@apollo/client";
import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { useState } from "react";

import { Link } from "@/components";
import { CabinsDocument, UpdateCabinDocument, UpdateCabinInput } from "@/generated/graphql";

import { CabinInfoForm } from "./CabinInfoForm";

function useCabins(): CabinInfoForm | undefined {
  const { data } = useQuery(CabinsDocument);
  const cabins = data?.cabins;
  const bjornen = cabins?.find((cabin) => cabin.name === "Bjørnen");
  const oksen = cabins?.find((cabin) => cabin.name === "Oksen");

  let values: CabinInfoForm | undefined;
  if (bjornen) {
    values = {
      bjornen: {
        internalPrice: bjornen.internalPrice,
        internalPriceWeekend: bjornen.internalPriceWeekend,
        externalPrice: bjornen.externalPrice,
        externalPriceWeekend: bjornen.externalPriceWeekend,
        externalStudentPrice: bjornen.externalStudentPrice,
        externalStudentPriceWeekend: bjornen.externalStudentPriceWeekend,
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
        externalStudentPrice: oksen.externalStudentPrice,
        externalStudentPriceWeekend: oksen.externalStudentPriceWeekend,
        maxGuests: oksen.maxGuests,
      },
    };
  }

  return values;
}

/** Component for editing cabin information. Only used on the admin page. */
export const CabinInfoPicker: React.FC = () => {
  const [alert, setAlert] = useState<
    | {
        severity: "success" | "error";
        message: string | React.ReactNode;
      }
    | undefined
  >(undefined);

  const cabins = useCabins();
  const [updateCabin] = useMutation(UpdateCabinDocument, {
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

  function handleSubmit(data: CabinInfoForm) {
    if (data.oksen) {
      const oksenData: UpdateCabinInput = {
        name: "Oksen",
        internalPrice: data.oksen.internalPrice,
        internalPriceWeekend: data.oksen.internalPriceWeekend,
        externalPrice: data.oksen.externalPrice,
        externalPriceWeekend: data.oksen.externalPriceWeekend,
        externalStudentPrice: data.oksen.externalStudentPrice,
        externalStudentPriceWeekend: data.oksen.externalStudentPriceWeekend,
        maxGuests: data.oksen.maxGuests,
      };
      updateCabin({ variables: { cabinData: oksenData } });
    }

    if (data.bjornen) {
      const bjornenData: UpdateCabinInput = {
        name: "Bjørnen",
        internalPrice: data.bjornen.internalPrice,
        internalPriceWeekend: data.bjornen.internalPriceWeekend,
        externalPrice: data.bjornen.externalPrice,
        externalPriceWeekend: data.bjornen.externalPriceWeekend,
        externalStudentPrice: data.bjornen.externalStudentPrice,
        externalStudentPriceWeekend: data.bjornen.externalStudentPriceWeekend,
        maxGuests: data.bjornen.maxGuests,
      };

      updateCabin({ variables: { cabinData: bjornenData } });
    }
  }

  return (
    <>
      <Snackbar open={Boolean(alert)} autoHideDuration={6000} onClose={() => setAlert(undefined)}>
        <Alert onClose={() => setAlert(undefined)} severity={alert?.severity}>
          {alert?.message}
        </Alert>
      </Snackbar>
      <CabinInfoForm
        onSubmit={handleSubmit}
        values={cabins}
        defaultValues={{
          oksen: {
            internalPrice: 1100,
            internalPriceWeekend: 1100,
            externalPrice: 3950,
            externalPriceWeekend: 5400,
            externalStudentPrice: 2950,
            externalStudentPriceWeekend: 3950,
            maxGuests: 18,
          },
          bjornen: {
            internalPrice: 1100,
            internalPriceWeekend: 1100,
            externalPrice: 3950,
            externalPriceWeekend: 5400,
            externalStudentPrice: 2950,
            externalStudentPriceWeekend: 3950,
            maxGuests: 18,
          },
        }}
      />
    </>
  );
};

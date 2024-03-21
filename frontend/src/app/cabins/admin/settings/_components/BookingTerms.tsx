"use client";

import { useAlerts } from "@/app/components/Alerts";
import { useFileUpload } from "@/app/components/FileUpload";
import { FileUploadField } from "@/app/components/FileUpload/FileUploadField";
import { MB_16 } from "@/app/components/FileUpload/useFileUpload";
import { NextLinkComposed } from "@/app/components/Link";
import { FragmentType, getFragmentData, graphql } from "@/gql/app";
import dayjs from "@/lib/date";
import { useMutation } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@mui/lab";
import { Box, Card, CardActions, CardContent, CardHeader, LinearProgress, NoSsr, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const BookingTermsQuery = graphql(`
  fragment BookingTerms_Query on Query {
    bookingTerms {
      bookingTerms {
        ...BookingTerms_BookingTerms
      }
    }
  }
`);

const BookingTermsFragment = graphql(`
  fragment BookingTerms_BookingTerms on BookingTerms {
    id
    createdAt
    file {
      id
      url
    }
  }
`);

type BookingTermsProps = {
  query: FragmentType<typeof BookingTermsQuery>;
};

const schema = z.object({
  file: z
    .instanceof(File)
    .nullable()
    .refine(
      (file) => {
        return file?.type === "application/pdf";
      },
      {
        message: "Filen må være en PDF",
      }
    )
    .refine(
      (file) => {
        if (!file) return true;
        return file?.size < MB_16;
      },
      {
        message: "Filen må være mindre enn 16 MB",
      }
    ),
});

type FormData = z.infer<typeof schema>;

function BookingTerms(props: BookingTermsProps) {
  const data = getFragmentData(BookingTermsQuery, props.query);
  const contract = getFragmentData(BookingTermsFragment, data.bookingTerms.bookingTerms);
  const { notify } = useAlerts();

  const {
    uploadFile,
    loading: uploadFileLoading,
    progress,
  } = useFileUpload({
    fileTypeAllowList: ["pdf"],
    fileMaxSizeBytes: MB_16,
    onComplete: () => {
      notify({ message: "Kontrakten er lastet opp", type: "success" });
    },
    onError(error) {
      notify({ title: "Noe gikk galt", message: error.message, type: "error" });
    },
  });

  const [updateBookingTerms, { loading: updateContractLoading }] = useMutation(
    graphql(`
      mutation BookingTerms_UpdateBookingTerms {
        updateBookingTerms {
          bookingTerms {
            ...BookingTerms_BookingTerms
          }
          uploadUrl
        }
      }
    `)
  );

  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const loading = updateContractLoading || uploadFileLoading;

  function onSubmit(data: FormData) {
    const { file } = data;
    if (!file) return;
    updateBookingTerms({
      async onCompleted({ updateBookingTerms }) {
        await uploadFile(file, updateBookingTerms.uploadUrl);
      },
      onError(error) {
        notify({ title: "Noe gikk galt", message: error.message, type: "error" });
      },
      update(cache, { data }) {
        if (data) {
          cache.evict({ fieldName: "bookingTerms" });
          cache.gc();
        }
      },
    });
  }

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader
          title="Bestillingsvilkår"
          subheader={contract && `Sist oppdatert ${dayjs(contract.createdAt).format("LLL")}`}
        />
        <CardContent>
          <Controller
            control={control}
            name="file"
            render={({ field: { value, ...field }, fieldState: { error } }) => (
              <FileUploadField
                {...field}
                value={value?.name}
                error={Boolean(error)}
                helperText={error?.message ?? "Last opp en ny kontrakt"}
              />
            )}
          />
          {uploadFileLoading && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" value={progress} />
              </Box>
              <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
              </Box>
            </Box>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: "space-between" }}>
          <NoSsr>
            {contract?.file.url && (
              <LoadingButton
                component={NextLinkComposed}
                to={contract.file.url}
                download
                target="_blank"
                loading={loading}
              >
                Se nåværende bestillingsvilkår
              </LoadingButton>
            )}
          </NoSsr>
          <LoadingButton type="submit" loading={loading} disabled={!isDirty}>
            Lagre
          </LoadingButton>
        </CardActions>
      </form>
    </Card>
  );
}

export { BookingTerms };

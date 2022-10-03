import { useQuery } from "@apollo/client";
import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";

import AnswerForm from "@/components/pages/forms/AnswerForm";
import { FORM_WITH_QUESTIONS_AND_ANSWERS } from "@/graphql/forms/queries";
import { Form } from "@/interfaces/forms";
import Layout, { RootStyle } from "@/layouts/Layout";
import { generateFeideLoginUrl } from "@/utils/auth";

import { NextPageWithLayout } from "../_app";

const FormPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { formId } = router.query;
  const { loading, error, data } = useQuery<{ form: Form }>(FORM_WITH_QUESTIONS_AND_ANSWERS, {
    variables: {
      formId: formId && (formId[0] as string),
    },
  });

  if (loading) return <p>Laster...</p>;
  if (error) {
    if (error.message.includes("permissions")) {
      const signInURL = generateFeideLoginUrl(router.asPath);
      router.push(signInURL);
      return (
        <Container>
          <Grid container direction="row" style={{ marginTop: 16 }} justifyContent="center">
            <Grid item>
              <Typography variant="subtitle1">Du må være logget inn for å se dette, sender deg til login.</Typography>
            </Grid>
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        </Container>
      );
    }
    return <p>Noe gikk galt...</p>;
  }

  return (
    <>
      {data && (
        <Container>
          <AnswerForm form={data.form} />
        </Container>
      )}
    </>
  );
};

FormPage.getLayout = (page) => (
  <Layout>
    <RootStyle>{page}</RootStyle>
  </Layout>
);

export default FormPage;

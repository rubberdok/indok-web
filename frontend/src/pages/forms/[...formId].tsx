import { useQuery } from "@apollo/client";
import AnswerForm from "@components/forms/AnswerForm";
import Layout from "@components/Layout";
import { FORM_WITH_QUESTIONS_AND_ANSWERS } from "@graphql/forms/queries";
import { Form } from "@interfaces/forms";
import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import { generateFeideLoginUrl } from "@utils/auth";
import { NextPage } from "next";
import { useRouter } from "next/router";

const FormPage: NextPage = () => {
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
        <Layout>
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
        </Layout>
      );
    }
    return <p>Noe gikk galt...</p>;
  }

  return (
    <Layout>
      {data && (
        <Container>
          <AnswerForm form={data.form} />
        </Container>
      )}
    </Layout>
  );
};

export default FormPage;

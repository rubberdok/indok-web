import { NextPage } from "next";
import Layout from "@components/Layout";
import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import AnswerForm from "@components/forms/AnswerForm";
import { useQuery } from "@apollo/client";
import { FORM_WITH_QUESTIONS_AND_ANSWERS } from "@graphql/forms/queries";
import { useRouter } from "next/router";
import { Form } from "@interfaces/forms";
import { DATAPORTEN_SCOPES } from "@utils/auth";
import { generateQueryString } from "@utils/helpers";
import { config } from "@utils/config";

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
      const queryString = generateQueryString({
        client_id: config.DATAPORTEN_ID,
        state: config.DATAPORTEN_STATE,
        redirect_uri: config.DATAPORTEN_REDIRECT_URI,
        response_type: "code",
        scope: DATAPORTEN_SCOPES.join(" "),
      });
      const signInURL = "https://auth.dataporten.no/oauth/authorization" + queryString;
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

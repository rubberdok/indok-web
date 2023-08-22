import { ApolloError, useQuery } from "@apollo/client";
import { Container } from "@mui/material";

import { AnswerForm } from "@/components/pages/forms/AnswerForm";
import { FormWithAnswersDocument } from "@/generated/graphql";
import { Layout, RootStyle } from "@/layouts/Layout";
import { addApolloState, initializeApollo } from "@/lib/apolloClient";
import { NextPageWithLayout } from "@/lib/next";
import { generateFeideLoginUrl } from "@/utils/auth";
import { ResultOf } from "@graphql-typed-document-node/core";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

const FormPage: NextPageWithLayout<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ form }) => {
  const { loading, error, data } = useQuery(FormWithAnswersDocument, { variables: { formId: form.id } });

  if (loading) return <p>Laster...</p>;
  if (error) {
    return <p>Noe gikk galt...</p>;
  }

  return (
    <>
      {data?.form && (
        <Container maxWidth="md">
          <AnswerForm form={data.form} />
        </Container>
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  form: NonNullable<ResultOf<typeof FormWithAnswersDocument>["form"]>;
}> = async (ctx) => {
  const client = initializeApollo({}, ctx);

  /**
   * Get the form ID from the query params, default to the first one if multiple are given.
   */
  const { formId } = ctx.query;
  let id: string;
  if (typeof formId === "string") {
    id = formId;
  } else if (Array.isArray(formId) && formId.length === 1) {
    id = formId[0];
  } else {
    return {
      notFound: true,
    };
  }

  /**
   * Fetch the form answers. If the user is not logged in, a permission error will be raised.
   * In that case, redirect the user to the login page.
   */
  try {
    const { data } = await client.query({
      query: FormWithAnswersDocument,
      variables: { formId: id },
    });

    if (data.form) {
      return addApolloState(client, {
        props: {
          form: data.form,
        },
      });
    }

    return {
      notFound: true,
    };
  } catch (err) {
    if (err instanceof ApolloError) {
      /**
       * User is not logged in, redirect to login page.
       */
      if (err.message.includes("permissions")) {
        return {
          redirect: {
            destination: generateFeideLoginUrl(ctx.resolvedUrl),
            permanent: false,
          },
        };
      }
    }
  }
  // Unknown error
  throw new Error("Something went wrong");
};

export default FormPage;

FormPage.getLayout = function getLayout(page) {
  return (
    <Layout>
      <RootStyle>{page}</RootStyle>
    </Layout>
  );
};

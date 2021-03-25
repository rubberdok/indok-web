import { NextPage } from "next";
import Layout from "@components/Layout";
import { CREATE_SURVEY } from "@graphql/surveys/mutations";
import { Survey } from "@interfaces/surveys";
import { useMutation } from "@apollo/client";
import { CREATE_LISTING } from "@graphql/listings/mutations";

const Demo: NextPage = () => {
  const [createSurvey, { data: surveyData }] = useMutation<{ createSurvey: { survey: Survey } }>(CREATE_SURVEY);
  const [createListing] = useMutation(CREATE_LISTING);
  return (
    <Layout>
      <button
        onClick={(e) => {
          e.preventDefault();
          createSurvey({
            variables: {
              name: "Test",
              description: "",
            },
          });
        }}
      >
        Test
      </button>
      {surveyData && (
        <button
          onClick={(e) => {
            e.preventDefault();
            createListing({
              variables: {
                title: "Test",
                description: "Test",
                startDatetime: "2021-01-21T16:01:00+00:00",
                deadline: "2021-01-21T16:01:00+00:00",
                endDatetime: "2021-01-21T16:01:00+00:00",
                url: "www.google.com",
                organizationId: 1,
                surveyId: surveyData!.createSurvey.survey.id,
              },
            });
          }}
        >
          Test2
        </button>
      )}
    </Layout>
  );
};

export default Demo;

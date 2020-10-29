import { useQuery } from "@apollo/client";
import { SURVEY } from "@graphql/surveys/queries";
import { Survey } from "@interfaces/surveys";
import Choice from "./formComponents/choice";
import TextField from "./formComponents/textfield";
import QuestionDetail from "@components/pages/surveys/questionDetail";

const SurveyDetail: React.FC<{ id: string }> = ({ id }) => {
    const { error, loading, data } = useQuery<{ survey: Survey }>(SURVEY, { variables: { ID: Number(id) } });
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    return (
        <>
            {data && (
                <>
                    <h1>{data.survey.descriptiveName}</h1>
                    {data.survey.questions.map((question) => {
                        <QuestionDetail question={question} active={true} />;
                    })}
                </>
            )}
        </>
    );
};

export default SurveyDetail;

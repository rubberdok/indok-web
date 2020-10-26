import { useQuery } from "@apollo/client";
import { SURVEY } from "@graphql/surveys/queries";
import { Survey } from "@interfaces/surveys";
import Choice from "./choice";
import TextField from "./textfield";

const SurveyDetail: React.FC<{ id: string }> = ({ id }) => {
    const { error, loading, data } = useQuery<{ survey: Survey }>(SURVEY, {variables: { ID: Number(id) }});
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error 🙃</p>;

    return (
        <>
            {data &&
                <>
                    <h1>{data.survey.descriptiveName}</h1>
                    {data.survey.surveyQuestions.map(surveyQuestion => {
                        switch (surveyQuestion.questionType.name) {
                            case "Textfield":
                                console.log("Tekstfelt!");
                                return <TextField title={surveyQuestion.question.question} size="short"/>;
                            case "Choice":
                                console.log("Valg!");
                                return ( 
                                    <Choice 
                                        title={surveyQuestion.question.question} 
                                        radio={true} 
                                        options={surveyQuestion.offeredAnswers.map(offeredAnswer => offeredAnswer.answer)}
                                    />
                                );
                        }
                    })}
                </>
            }
        </>

    )
};

export default SurveyDetail;
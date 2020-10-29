import { SurveyQuestion } from "@interfaces/surveys";
import TextField from "@components/pages/surveys/formComponents/textfield";
import Choice from "@components/pages/surveys/formComponents/choice";

const Question: React.FC<{ question: SurveyQuestion }> = ({ question }) => {
    switch (question.questionType.name) {
        case "Textfield":
            return <TextField title={question.question.question} size="short" />;
        case "Choice":
            return (
                <Choice
                    title={question.question.question}
                    radio={true}
                    options={question.offeredAnswers.map((offeredAnswer) => offeredAnswer.answer)}
                />
            );
        default:
            return <TextField title={question.question.question} />;
    }
};

export default Question;

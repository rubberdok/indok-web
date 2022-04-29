import questionTypeLabels from "@components/forms/formAdmin/questionTypeLabels";
import { Question, QuestionType, Option } from "@interfaces/forms";
import {
  Button,
  Checkbox,
  Grid,
  MenuItem,
  Radio,
  Select,
  TextField,
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { Save, Delete, Add, Close } from "@mui/icons-material";

/**
 * Component to edit a question on a form.
 * Renders input fields to change the question's details.
 * If the question's type allows options, allows the creation of such.
 *
 * Props:
 * - state of the question to edit
 * - setQuestion function to set question state
 * - saveQuestion function to save this question to the database and then set it as inactive
 * - deleteQuestion function to delete this question from the database
 */
const EditQuestion: React.FC<{
  question: Question;
  setQuestion: (question: Question | undefined) => void;
  saveQuestion: () => void;
  deleteQuestion: () => void;
}> = ({ question, setQuestion, saveQuestion, deleteQuestion }) => (
  <Grid container direction="column" spacing={1}>
    <Grid item>
      <TextField
        label="Spørsmål"
        fullWidth
        value={question.question}
        onChange={(e) => {
          setQuestion({
            ...question,
            question: e.target.value,
          });
        }}
        variant="filled"
      />
    </Grid>
    <Grid item container direction="row" alignItems="center" spacing={3}>
      <Grid item xs={12} md={4}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
            fullWidth
            value={question.questionType}
            onChange={(e) => {
              const questionType = e.target.value as QuestionType;
              let firstOption: Option | undefined = undefined;
              if (
                question.options &&
                question.options.length === 0 &&
                (questionType === "CHECKBOXES" || questionType === "MULTIPLE_CHOICE" || questionType === "DROPDOWN")
              ) {
                firstOption = { id: "", answer: "" };
              }
              setQuestion({
                ...question,
                questionType: questionType,
                ...(firstOption ? { options: [firstOption] } : {}),
              });
            }}
            variant="filled"
          >
            {Object.entries(questionTypeLabels)
              // TODO: remove below line once Slider and File Upload question types are implemented
              .filter(([questionType]) => !(questionType === "SLIDER" || questionType === "FILE_UPLOAD"))
              .map(([questionType, label]) => (
                <MenuItem key={questionType} value={questionType}>
                  {label}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={8}>
        <FormControlLabel
          label="Obligatorisk"
          control={
            <Switch
              checked={question.mandatory}
              onChange={(event) => setQuestion({ ...question, mandatory: event.target.checked })}
              color="primary"
            />
          }
        />
      </Grid>
    </Grid>
    {(question.questionType === "CHECKBOXES" ||
      question.questionType === "MULTIPLE_CHOICE" ||
      question.questionType === "DROPDOWN") && (
      <Grid item container direction="column" spacing={1}>
        {question.options &&
          question.options.map((option, index) => (
            <Grid key={index} item container direction="row" alignItems="center">
              <Grid item>
                {question.questionType === "CHECKBOXES" ? (
                  <Checkbox disabled />
                ) : question.questionType === "MULTIPLE_CHOICE" ? (
                  <Radio disabled />
                ) : (
                  <Box pl={1} pr={1}>
                    {index + 1}.
                  </Box>
                )}
              </Grid>
              <Grid item xs>
                <TextField
                  variant="filled"
                  fullWidth
                  value={option.answer}
                  onChange={(e) => {
                    setQuestion({
                      ...question,
                      options: (question.options ?? []).map((oldAnswer) =>
                        oldAnswer === option ? { ...oldAnswer, answer: e.target.value } : oldAnswer
                      ),
                    });
                  }}
                />
              </Grid>
            </Grid>
          ))}
        <Grid item>
          <Button
            variant="outlined"
            fullWidth
            startIcon={<Add />}
            onClick={() => {
              setQuestion({
                ...question,
                options: [...(question.options ?? []), { id: "", answer: "" }],
              });
            }}
          >
            Nytt svaralternativ
          </Button>
        </Grid>
      </Grid>
    )}
    <Grid item container direction="row" spacing={1}>
      <Grid item>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Save />}
          onClick={() => {
            saveQuestion();
          }}
        >
          Lagre
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          startIcon={<Close />}
          onClick={() => {
            setQuestion(undefined);
          }}
        >
          Avbryt
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          startIcon={<Delete />}
          onClick={() => {
            deleteQuestion();
          }}
        >
          Slett
        </Button>
      </Grid>
    </Grid>
  </Grid>
);

export default EditQuestion;

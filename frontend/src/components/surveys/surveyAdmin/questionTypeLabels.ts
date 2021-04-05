import { QuestionType } from "@interfaces/surveys";

// maps question types to Norwegian labels
const questionTypeLabels: { [key in QuestionType]: string } = {
  PARAGRAPH: "Langsvar",
  SHORT_ANSWER: "Kortsvar",
  MULTIPLE_CHOICE: "Flervalg",
  CHECKBOXES: "Avkrysning",
  DROPDOWN: "Nedtrekk",
  SLIDER: "Skala",
  FILE_UPLOAD: "Filopplasting",
};

export default questionTypeLabels;

import { QuestionTypeEnum } from "@/generated/graphql";

// maps question types to Norwegian labels
export const questionTypeLabels: { [key in QuestionTypeEnum]: string } = {
  [QuestionTypeEnum.Paragraph]: "Langsvar",
  [QuestionTypeEnum.ShortAnswer]: "Kortsvar",
  [QuestionTypeEnum.MultipleChoice]: "Flervalg",
  [QuestionTypeEnum.Checkboxes]: "Avkrysning",
  [QuestionTypeEnum.Dropdown]: "Nedtrekk",
  [QuestionTypeEnum.Slider]: "Skala",
  [QuestionTypeEnum.FileUpload]: "Filopplasting",
};

import { User } from "@interfaces/users";

export interface Form {
  id: string;
  name: string;
  description: string;
  questions: Question[];
  responses?: Response[];
  response?: Response;
}

export interface Question {
  id: string;
  question: string;
  description: string;
  mandatory: boolean;
  questionType: QuestionType;
  options?: Option[];
  answers?: Answer[];
  answer?: Answer;
}

export type QuestionType =
  | "PARAGRAPH"
  | "SHORT_ANSWER"
  | "MULTIPLE_CHOICE"
  | "CHECKBOXES"
  | "DROPDOWN"
  | "SLIDER"
  | "FILE_UPLOAD";

export interface Option {
  id: string;
  answer: string;
}

export interface Answer {
  id: string;
  answer?: string;
  question?: Question;
}

export interface Response {
  id: string;
  respondent: User;
  answers: Answer[];
}

// interface for the variables in certain question mutations
export interface QuestionVariables {
  id: string;
  question: string;
  description: string;
  questionType: QuestionType;
  mandatory: boolean;
  options: {
    answer: string;
    id?: string;
  }[];
}

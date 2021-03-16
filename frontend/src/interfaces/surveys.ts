import { User } from "@interfaces/users";

export interface Survey {
  id: string;
  descriptiveName: string;
  description: string;
  questions: Question[];
  responders: User[];
}

export interface Question {
  id: string;
  survey: Survey;
  question: string;
  description: string;
  position: string;
  questionType: QuestionType;
  options: Option[];
  answers: Answer[];
}

export interface QuestionType {
  id: string;
  name: string;
}

export interface Option {
  id: string;
  answer: string;
}

export interface Answer {
  id: string;
  answer: string;
  question: Question;
}

// interface for the variables in certain question mutations
export interface QuestionVariables {
  id: string;
  question: string;
  description: string;
  position: string;
  questionTypeId: string;
  options: {
    answer: string;
    questionId?: string;
    id?: string;
  }[];
}

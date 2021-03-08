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
  offeredAnswers: OfferedAnswer[];
  answers: Answer[];
}

export interface QuestionType {
  id: string;
  name: string;
}

export interface OfferedAnswer {
  id: string;
  answer: string;
}

export interface Answer {
  id: string;
  answer: string;
  question: Question;
}

export interface QuestionVariables {
  id: string;
  question: string;
  description: string;
  position: string;
  questionTypeId: string;
}

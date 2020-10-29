import { Listing } from "@interfaces/listings";

export interface Survey {
    id: string;
    descriptiveName: string;
    description: string;
    questions: Question[];
    listing: Listing;
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

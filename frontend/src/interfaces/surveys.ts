export interface Survey {
    id: string;
    descriptiveName: string;
    description: string;
    questions: Question[];
}

export interface Question {
    id: string;
    survey: Survey;
    question: String;
    description: String;
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

export interface Survey {
    id: string;
    descriptiveName: string;
    description: string;
    surveyQuestions: SurveyQuestion[];
}

export interface Question {
    id: string;
    question: string;
    description: string;
    slug: string;
}

export interface SurveyQuestion {
    id: string;
    survey: Survey;
    question: Question;
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
    surveyQuestion: SurveyQuestion;
}
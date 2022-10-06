import {
  AnswerFragment,
  FormFragment,
  FormWithResponsesFragment,
  QuestionFragment,
  QuestionWithAnswersFragment,
  ResponseFragment,
} from "@/generated/graphql";
import { GraphqlType } from "@/utils/graphql";

export type Form = GraphqlType<FormFragment>;

export type Question = GraphqlType<QuestionFragment>;

export type Answer = GraphqlType<AnswerFragment>;

export type QuestionWithAnswers = GraphqlType<QuestionWithAnswersFragment>;

export type Response = GraphqlType<ResponseFragment>;

export type FormWithResponses = GraphqlType<FormWithResponsesFragment>;

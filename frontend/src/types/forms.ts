import {
  AnswerFragment,
  AnswerWithQuestionIdFragment,
  FormFragment,
  FormWithAllResponsesFragment,
  FormWithAnswersFragment,
  OptionFragment,
  QuestionFragment,
  QuestionWithAnswerFragment,
  QuestionWithAnswerIdsFragment,
  ResponseFragment,
} from "@/generated/graphql";
import { GraphqlType } from "@/utils/graphql";

export type Form = GraphqlType<FormFragment>;

export type FormWithAnswers = GraphqlType<FormWithAnswersFragment>;

export type FormWithAllResponses = GraphqlType<FormWithAllResponsesFragment>;

export type Response = GraphqlType<ResponseFragment>;

export type Question = GraphqlType<QuestionFragment>;

export type QuestionWithAnswer = GraphqlType<QuestionWithAnswerFragment>;

export type QuestionWithAnswerIds = GraphqlType<QuestionWithAnswerIdsFragment>;

export type Option = GraphqlType<OptionFragment>;

export type Answer = GraphqlType<AnswerFragment>;

export type AnswerWithQuestionId = GraphqlType<AnswerWithQuestionIdFragment>;

/**
 * This page is loaded by Nextjs:
 *  - on the server, when data-fetching methods throw or reject
 *  - on the client, when `getInitialProps` throws or rejects
 *  - on the client, when a React lifecycle method throws or rejects, and it's
 *    caught by the built-in Nextjs error boundary
 *
 * See:
 *  - https://nextjs.org/docs/basic-features/data-fetching/overview
 *  - https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
 *  - https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */

import { captureUnderscoreErrorException } from "@sentry/nextjs";
import { NextPageContext } from "next";
import NextErrorComponent, { ErrorProps as NextErrorProps } from "next/error";

export type ErrorComponentProps = {
  err: Error;
  statusCode: number;
  isReadyToRender: boolean;
};

export type ErrorProps = {
  isReadyToRender: boolean;
} & NextErrorProps;

const ErrorComponent = (props: ErrorComponentProps): JSX.Element => (
  <NextErrorComponent statusCode={props.statusCode} />
);

ErrorComponent.getInitialProps = async (contextData: NextPageContext & { [key: string]: unknown }) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await captureUnderscoreErrorException(contextData);

  // This will contain the status code of the response
  return NextErrorComponent.getInitialProps(contextData);
};

export default ErrorComponent;

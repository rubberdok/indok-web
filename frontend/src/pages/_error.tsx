import * as Sentry from "@sentry/node";
import NextErrorComponent, { ErrorProps as NextErrorProps } from "next/error";
import { NextPageContext } from "next";

export type ErrorPageProps = {
  err: Error;
  statusCode: number;
  isReadyToRender: boolean;
};

export type ErrorProps = {
  isReadyToRender: boolean;
} & NextErrorProps;

const ErrorPage = ({ statusCode, isReadyToRender, err }: ErrorPageProps): JSX.Element => {
  if (!isReadyToRender && err) {
    Sentry.captureException(err);
  }
  return <NextErrorComponent statusCode={statusCode} />;
};

ErrorPage.getInitialProps = async ({ res, err, asPath }: NextPageContext): Promise<ErrorProps> => {
  const errorInitialProps: ErrorProps = (await NextErrorComponent.getInitialProps({
    res,
    err,
  } as NextPageContext)) as ErrorProps;

  errorInitialProps.isReadyToRender = true;

  if (res?.statusCode === 404) {
    return { statusCode: 404, isReadyToRender: true };
  }

  if (err) {
    Sentry.captureException(err);
    await Sentry.flush(2000);
    return errorInitialProps;
  }

  Sentry.captureException(new Error(`_error.js getInitialProps missing data at path: ${asPath}`));
  await Sentry.flush(2000);

  return errorInitialProps;
};

export default ErrorPage;

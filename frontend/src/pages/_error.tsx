import { captureUnderscoreErrorException } from "@sentry/nextjs";
import { NextPageContext } from "next";
import NextErrorComponent, { ErrorProps as NextErrorProps } from "next/error";

export type ErrorPageProps = {
  err: Error;
  statusCode: number;
  isReadyToRender: boolean;
};

export type ErrorProps = {
  isReadyToRender: boolean;
} & NextErrorProps;

const ErrorPage = (props: ErrorPageProps): JSX.Element => {
  captureUnderscoreErrorException(props);
  return <NextErrorComponent statusCode={props.statusCode} />;
};

ErrorPage.getInitialProps = async (contextData: NextPageContext & { [key: string]: unknown }) => {
  await captureUnderscoreErrorException(contextData);
  return NextErrorComponent.getInitialProps(contextData);
};

export default ErrorPage;

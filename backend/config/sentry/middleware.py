from inspect import isawaitable
from typing import Any, NoReturn
from sentry_sdk.api import capture_exception


class SentryMiddleware:
    def on_error(self, error: BaseException) -> NoReturn:
        """
        Capture the error and log it to Sentry prior to Graphene catching the error
        Allows tracing of errors other than "GraphQLError"

        Parameters
        ----------
        error : BaseException

        Returns
        -------
        NoReturn

        Raises
        ------
        error
        """
        capture_exception(error)
        raise error

    def resolve(self, next, root, info: Any, **args):
        try:
            result = next(root, info, **args)
        except Exception as error:
            self.on_error(error)

        catch = getattr(result, "catch", None)
        if callable(catch):
            return catch(self.on_error)

        if isawaitable(result):

            async def _await_result():
                try:
                    return await result
                except Exception as error:
                    self.on_error(error)

            return _await_result()

        return result

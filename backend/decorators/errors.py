from django.core.exceptions import PermissionDenied as PermissionDeniedBase


class LoginRequiredError(PermissionDeniedBase):
    pass


class PermissionDenied(PermissionDeniedBase):
    pass

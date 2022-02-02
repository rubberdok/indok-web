from graphene.types import ResolveInfo


def allow_any(info: ResolveInfo, **kwargs):
    # Compatiblity
    return False

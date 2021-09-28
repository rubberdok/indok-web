class PermissionResolvers:
    def resolve_has_permission(self, info, permission: str):
        return info.context.user.has_perm(permission)

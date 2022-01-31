class PermissionResolvers:
    def resolve_has_permission(self, info, permission: str) -> bool:
        return info.context.user.has_perm(permission)

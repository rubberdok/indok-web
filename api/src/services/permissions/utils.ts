import { z } from "zod"
import { PermissionString } from "./types"

export const isPermissionString = (permission: string): permission is PermissionString => {
  const [scope, entity, identifier] = permission.split(":")
  
  if (scope !== "read" && scope !== "write") return false
  if (entity === undefined) return false
  if (identifier === undefined) return true
  const { success } = z.string().uuid().safeParse(identifier)
  return success
}
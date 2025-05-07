// src/lib/check-permissions.js
import { PERMISSIONS } from "./permissions";

/**
 * Valida si el rol tiene permiso para una acción sobre un recurso.
 * @param {string} role - Rol del usuario
 * @param {string} resource - Nombre del recurso, ej: 'proyectos'
 * @param {string} action - Acción, ej: 'read' | 'create' | 'update' | 'delete'
 * @returns {boolean}
 */
export function checkPermission({ role, resource, action }) {
  const rolePerms = PERMISSIONS[role];

  if (!rolePerms) return false;

  if (rolePerms['*']?.includes('*')) return true;

  const allowedActions = rolePerms[resource];
  if (!allowedActions) return false;

  return allowedActions.includes(action);
}

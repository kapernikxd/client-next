const ADMIN_ROLES = ['superAdmin', 'admin']

export const isAdminRole = (role?: string) => {
    if (!role) return false;
    return ADMIN_ROLES.includes(role)
}
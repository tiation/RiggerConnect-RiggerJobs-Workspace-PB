import { Role, Permission } from '../types';

export class RBACService {
  private rolePermissions: Map<Role, Set<Permission>>;

  constructor() {
    this.rolePermissions = new Map();
    this.initializeRolePermissions();
  }

  private initializeRolePermissions(): void {
    // Admin has all permissions
    this.rolePermissions.set(Role.ADMIN, new Set(Object.values(Permission)));

    // Employer permissions
    this.rolePermissions.set(
      Role.EMPLOYER,
      new Set([
        Permission.CREATE_JOB,
        Permission.VIEW_JOBS,
        Permission.VERIFY_CREDENTIALS
      ])
    );

    // Worker roles (Rigger, Dogger, Crane Operator) permissions
    const workerPermissions = new Set([Permission.VIEW_JOBS]);
    this.rolePermissions.set(Role.RIGGER, workerPermissions);
    this.rolePermissions.set(Role.DOGGER, workerPermissions);
    this.rolePermissions.set(Role.CRANE_OPERATOR, workerPermissions);

    // Safety Officer permissions
    this.rolePermissions.set(
      Role.SAFETY_OFFICER,
      new Set([
        Permission.VIEW_JOBS,
        Permission.VERIFY_CREDENTIALS,
        Permission.MANAGE_SAFETY_RECORDS
      ])
    );
  }

  hasPermission(role: Role, permission: Permission): boolean {
    const permissions = this.rolePermissions.get(role);
    return permissions ? permissions.has(permission) : false;
  }

  getRolePermissions(role: Role): Permission[] {
    const permissions = this.rolePermissions.get(role);
    return permissions ? Array.from(permissions) : [];
  }

  validatePermissions(role: Role, requiredPermissions: Permission[]): boolean {
    return requiredPermissions.every(permission => this.hasPermission(role, permission));
  }

  // Helper method to check if a role can perform specific actions
  canPerformAction(role: Role, action: string): boolean {
    switch (action) {
      case 'createJob':
        return this.hasPermission(role, Permission.CREATE_JOB);
      case 'viewJobs':
        return this.hasPermission(role, Permission.VIEW_JOBS);
      case 'verifySafety':
        return this.hasPermission(role, Permission.MANAGE_SAFETY_RECORDS);
      case 'verifyCredentials':
        return this.hasPermission(role, Permission.VERIFY_CREDENTIALS);
      default:
        return false;
    }
  }
}

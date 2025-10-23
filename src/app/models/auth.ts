export interface AuthRequest {
  emailOrUsername: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  id: number;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export enum Role {
  ROLE_USER = 'ROLE_USER',
  ROLE_ADMIN = 'ROLE_ADMIN',
}

export enum Permit {
  READ = 'READ',
  WRITE = 'WRITE',
  DELETE = 'DELETE',
}

export interface PermitEntity {
  id: number;
  permit: Permit;
}

export interface RoleEntity {
  id: number;
  role: Role;
  permits: PermitEntity[];
}

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

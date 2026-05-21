export type AuthStep = 'select' | 'login';
export type AdminRole = 'SUPER_ADMIN' | 'CONFIGURATION_ADMIN';

export interface LoginFields {
  username: string;
  password: string;
}

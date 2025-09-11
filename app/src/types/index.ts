export type Role = 'farmer' | 'merchant' | 'investor' | 'admin';

export interface User {
  id: string;
  role: Role;
  locale: 'en' | 'es';
}

export interface FarmerProfile {
  userId: string;
  region: string;
  wallet: string;
}

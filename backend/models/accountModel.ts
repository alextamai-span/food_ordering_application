export interface Account {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: Date;
  account_type: 'guest' | 'employee';
}
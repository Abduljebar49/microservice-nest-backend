import { User } from 'src/auth/entities/user.entity';

export interface RResponse {
  message: string;
  data: any;
  error?: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
  message: string;
  status: number;
  error?: string;
}

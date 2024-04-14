
export interface RResponse {
  message: string;
  data: any;
  error?: string;
}

export interface LoginResponse {
  accessToken: string;
  data: any;
  message: string;
  status: number;
  error?: string;
}

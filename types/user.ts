export interface UserType {
  id: string;
  email: string;
  user_name: string;
  level: number;
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  username: string;
}

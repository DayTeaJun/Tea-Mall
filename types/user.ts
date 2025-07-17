export interface UserType {
  id: string;
  email: string;
  user_name: string;
  level: number;
  profile_image_url?: string | null;
  address: string;
  phone: string;
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

export interface UserProfileType {
  id: string;
  user_name: string;
  profile_image_url?: string | null;
  address: string;
  phone: string;
}

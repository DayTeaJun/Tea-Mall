export interface DefaultAddressType {
  address: string;
  detail_address: string | null;
  postal_code: string;
}

export interface UserType {
  id: string;
  email: string;
  user_name: string;
  level: number;
  profile_image_url?: string | null;
  phone?: string | null;
  status?: string;
  created_at?: string;
  updated_at?: string;
  last_login_at?: string;
  default_address?: DefaultAddressType[] | null;
  address?: string;

  app_metadata?: {
    provider?: "email" | string;
  };
}

export interface SignInFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  username: string;
  password?: string;
  id?: string;
  phone?: string;
  address?: string;
  profile_image_url?: string;
}

export interface UserProfileType {
  id: string;
  user_name: string;
  profile_image_url?: string | null;
  phone: string;
}

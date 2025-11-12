export interface Register {
    userName: string;
    email: string;
    password: string;
}
export interface Login {
    email: string;
    password: string;
}
export interface LoginResult {
    success: boolean;
    userName:string
    message: string;
    error: string[];
    token: string
}

export interface Address {
  id: number;
  label?: string;
  recipientName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode?: string;
  phone?: string;
  isDefault: boolean;
}

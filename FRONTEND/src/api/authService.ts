import api from "./axios";

export interface IUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: IUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  password: string;
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", payload);
  return response.data;
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", payload);
  return response.data;
};

export const forgotPassword = async (payload: ForgotPasswordPayload): Promise<{ success: boolean; message: string }> => {
  const response = await api.post("/auth/forgot-password", payload);
  return response.data;
};

export const resetPassword = async (token: string, payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> => {
  const response = await api.put(`/auth/reset-password/${token}`, payload);
  return response.data;
};
import instance from "@/lib/axios/instance";
import { IChangePasswordRequest, IForgotPasswordRequest, ILoginRequest, ILoginResponse, IProfileResponse, IResetPasswordRequest, ISuccessResponse } from "@/types/Auth";
import endpoint from "./endpoint.constant";

const authService = {
  login: async (payload: ILoginRequest): Promise<ILoginResponse> => {
    const response = await instance.post<ILoginResponse>(`${endpoint.AUTH}/login`, payload);
    return response.data;
  },

  logout: async (): Promise<ISuccessResponse> => {
    const response = await instance.post<ISuccessResponse>(`${endpoint.AUTH}/logout`);
    return response.data;
  },

  updateFCMToken: async (fcmToken: string): Promise<ISuccessResponse> => {
    const response = await instance.patch<ISuccessResponse>(`${endpoint.AUTH}/update-fcm-token`, { fcmToken });
    return response.data;
  },

  getProfile: async (): Promise<IProfileResponse> => {
    const response = await instance.get<IProfileResponse>(`${endpoint.AUTH}/profile`);
    return response.data;
  },

  updateProfile: async (payload: Partial<{ name: string; email: string; username: string }>): Promise<IProfileResponse> => {
    const response = await instance.patch<IProfileResponse>(`${endpoint.AUTH}/update-profile`, payload);
    return response.data;
  },

  changePassword: async (payload: IChangePasswordRequest): Promise<ISuccessResponse> => {
    const response = await instance.put<ISuccessResponse>(`${endpoint.AUTH}/change-password`, payload);
    return response.data;
  },

  forgotPassword: async (payload: IForgotPasswordRequest): Promise<ISuccessResponse> => {
    const response = await instance.post<ISuccessResponse>(`${endpoint.AUTH}/forgot-password`, payload);
    return response.data;
  },

  resetPassword: async (payload: IResetPasswordRequest): Promise<ISuccessResponse> => {
    const response = await instance.post<ISuccessResponse>(`${endpoint.AUTH}/reset-password`, payload);
    return response.data;
  },
};

export default authService;

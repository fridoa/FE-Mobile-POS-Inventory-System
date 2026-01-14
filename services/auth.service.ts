import instance from "@/lib/axios/instance";
import { IChangePasswordRequest, ILoginRequest, ILoginResponse, IProfileResponse, ISuccessResponse } from "@/types/Auth";
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

  getProfile: async (): Promise<IProfileResponse> => {
    const response = await instance.get<IProfileResponse>(`${endpoint.AUTH}/profile`);
    return response.data;
  },

  changePassword: async (payload: IChangePasswordRequest): Promise<ISuccessResponse> => {
    const response = await instance.put<ISuccessResponse>(`${endpoint.AUTH}/change-password`, payload);
    return response.data;
  },
};

export default authService;

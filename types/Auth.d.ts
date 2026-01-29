export interface IApiResponse<T> {
  meta: {
    status: string;
    message: string;
  };
  data: T;
}

export interface IApiError {
  meta: {
    code: number;
    status: string;
    message: string;
  };
  data: null;
}

export type TRole = "admin" | "kasir";

export interface ITokens {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

export interface ILoginRequest {
  username: string;
  password: string;
  fcmToken?: string;
}

export interface IRefreshTokenRequest {
  refreshToken: string;
}

export interface IChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface IUpdateFcmTokenRequest {
  fcmToken: string;
}

export interface IForgotPasswordRequest {
  email: string;
}

export interface IResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export type ILoginResponse = IApiResponse<ITokens>;

export type IProfileResponse = IApiResponse<IUser>;

export type ISuccessResponse = IApiResponse<null>;

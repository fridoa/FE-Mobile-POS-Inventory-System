import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "auth_access_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";

export const getToken = async (key: "access" | "refresh") => {
  return await SecureStore.getItemAsync(key === "access" ? ACCESS_TOKEN_KEY : REFRESH_TOKEN_KEY);
};

export const setTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
};

export const clearTokens = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

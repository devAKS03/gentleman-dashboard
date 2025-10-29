import { baseApi } from "@/Redux/api/baseApi";

interface ChangePasswordRequest {
  oldPassword: string;
  password: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body, // body = { oldPassword, password }
      }),
    }),
  }),
});

export const { useChangePasswordMutation } = authApi;

import { baseApi } from "@/Redux/api/baseApi";



export const serviceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteService: builder.mutation<{ success: boolean; id: string }, string>({
      query: (serviceId) => ({
        url: `/services/${serviceId}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useDeleteServiceMutation } = serviceApi;

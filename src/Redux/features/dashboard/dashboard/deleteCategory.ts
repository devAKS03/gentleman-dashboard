import { baseApi } from "@/Redux/api/baseApi";


// Inject delete endpoint
export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    deleteCategory: builder.mutation<{ success: boolean; id: string }, string>({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "DELETE",
      }),
    }),
  }),
  overrideExisting: false,
});

// Export hooks for usage in components
export const { useDeleteCategoryMutation } = categoryApi;

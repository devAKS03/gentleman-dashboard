// this is baseApi
import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryApi,
  BaseQueryFn,
  DefinitionType,
  FetchArgs,
} from "@reduxjs/toolkit/query/react";

import { setUser } from "../features/auth/authSlice";
import type { RootState } from "../store";

const baseQuery=fetchBaseQuery({baseUrl:'https://findcarpros.com/gntl/v1',

            // credentials:'include',
            prepareHeaders: (headers, { getState }) => {
                        const token = (getState() as RootState).auth.token;

                        if(token){
                                    headers.set('authorization',`${token}`)
                        }
                    return headers;
              },

            
                    
})


const baseQueryWithRefreshToken:BaseQueryFn<FetchArgs,BaseQueryApi,DefinitionType>=async(args, api,extraOptions):Promise<any>=>{
            let result= await baseQuery(args, api,extraOptions)

            if (result?.error?.status === 401) {
                console.log("sending refresh token");
        
                const res = await fetch("https://findcarpros.com/gntl/v1/auth/refresh-token", {
                    method: "POST",
                    credentials: "include",
                });
                const data=await res.json()
                console.log(data);
        

                const user=(api.getState() as RootState).auth.user

                api.dispatch(
                    setUser({
                        user,
                        token:data.data.accessToken
                    })
                )
                result = await baseQuery(args, api, extraOptions);
            }
            return result;
            
}

export const baseApi=createApi({
            reducerPath:'baseApi',
            baseQuery:baseQueryWithRefreshToken,

            endpoints:()=>({}),
            tagTypes: ['Services',"Categories"],
            
            

})

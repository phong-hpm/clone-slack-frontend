import axios from "axios";
import { AnyAction, EnhancedStore, MiddlewareArray } from "@reduxjs/toolkit";

import { setTokens } from "../store/slices/auth.slice";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let queues: (() => void)[] = [];

export const setupAxios = (store: EnhancedStore<any, AnyAction, MiddlewareArray<any>>) => {
  // config token headers
  axiosInstance.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken && config.headers) {
        config.headers["x-access-token"] = accessToken;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const {
        config,
        response: { status },
      } = error;
      const originalRequest = config;

      // handle error 401
      if (status === 401) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const postData = { refreshToken: localStorage.getItem("refreshToken") };
            const { data } = await axiosInstance.post("/auth/refresh-token", { postData });

            isRefreshing = false;
            originalRequest.headers["x-access-token"] = data.accessToken;

            // update access token to localstorage
            localStorage.setItem("accessToken", data.accessToken);

            onRefreshed();

            // update access token to redux
            store.dispatch(setTokens(data));
          } catch (refreshTokenError) {
            return Promise.reject(refreshTokenError);
          }
        }

        return new Promise((resolve, reject) => {
          queues.push(() => {
            resolve(axiosInstance(originalRequest));
          });
        });
      }
    }
  );
};

const onRefreshed = () => {
  queues.forEach((cb) => cb());
  queues = [];
};

export default axiosInstance;

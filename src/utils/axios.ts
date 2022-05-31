import axios from "axios";
import { AnyAction, EnhancedStore, MiddlewareArray } from "@reduxjs/toolkit";

import { setTokens } from "store/slices/auth.slice";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "content-type": "application/json",
  },
  withCredentials: true,
});

let isRefreshing = false;
let retryTimes = 1;
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
      if (status === 401 && retryTimes) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            queues.push(() => {
              resolve(axiosInstance(originalRequest));
            });
          });
        }

        retryTimes--;
        isRefreshing = true;
        return new Promise((resolve, reject) => {
          const refreshToken = localStorage.getItem("refreshToken") || "";
          axiosInstance
            .post("/auth/refresh-token", { postData: { refreshToken } })
            .then(({ data }) => {
              originalRequest.headers["x-access-token"] = data.accessToken;
              // update access token to localstorage
              localStorage.setItem("accessToken", data.accessToken);
              console.log("data", data);
              // update access token to redux
              store.dispatch(setTokens({ accessToken: data.accessToken }));
              resolve(axiosInstance(originalRequest));
            })
            .catch(() => {
              localStorage.removeItem("accessToken");
              store.dispatch(setTokens({ refreshToken: "", accessToken: "" }));
            })
            .then(() => {
              onRefreshed();
              isRefreshing = false;
            });
        });
      }

      return Promise.reject(error);
    }
  );
};

const onRefreshed = () => {
  queues.forEach((cb) => cb());
  queues = [];
};

export default axiosInstance;

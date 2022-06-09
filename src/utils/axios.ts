import axios from "axios";
import { AnyAction, EnhancedStore, MiddlewareArray } from "@reduxjs/toolkit";

// redux slices
import { setTokens } from "store/slices/user.slice";

// utils
import { apiUrl } from "./constants";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVER_BASE_URL,
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
    /* istanbul ignore next */
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const status = error?.response?.status;
      const originalRequest = error?.config;
      // handle error 401
      if (status === 401) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            queues.push(() => {
              resolve(axiosInstance(originalRequest));
            });
          });
        }

        // prevent getting new accessToken multiple times
        if (retryTimes) {
          retryTimes--;
          isRefreshing = true;
          return new Promise((resolve, reject) => {
            const refreshToken = localStorage.getItem("refreshToken") || "";
            axiosInstance
              .post(apiUrl.auth.refreshToken, { postData: { refreshToken } })
              .then(({ data }) => {
                originalRequest.headers["x-access-token"] = data.accessToken;
                // update access token to localstorage
                localStorage.setItem("accessToken", data.accessToken);
                // update access token to redux
                store.dispatch(setTokens({ accessToken: data.accessToken }));
                resolve(axiosInstance(originalRequest));
              })
              .catch((refreshTokenError) => {
                localStorage.removeItem("accessToken");
                store.dispatch(setTokens({ refreshToken: "", accessToken: "" }));
                reject(refreshTokenError);
              })
              .then(() => {
                onRefreshed();
                isRefreshing = false;
              });
          });
        }
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

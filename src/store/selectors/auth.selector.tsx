import { createSelector } from "reselect";

import { RootState } from "..";

export const getAuth = (state: RootState) => state.auth;

export const isAuth = createSelector([getAuth], (auth) => auth.isAuth);
export const isLoading = createSelector([getAuth], (auth) => auth.isLoading);
export const isVerified = createSelector([getAuth], (auth) => auth.isVerified);
export const getAccessToken = createSelector([getAuth], (auth) => auth.accessToken);
export const getRefreshToken = createSelector([getAuth], (auth) => auth.refreshToken);

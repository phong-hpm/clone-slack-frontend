import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

export const getAuth = (state: RootState) => state.auth;

export const isAuth = createSelector([getAuth], (auth) => auth.isAuth);
export const isLoading = createSelector([getAuth], (auth) => auth.isLoading);
export const isVerified = createSelector([getAuth], (auth) => auth.isVerified);

export const getAccessToken = createSelector([getAuth], (auth) => auth.accessToken);
export const getRefreshToken = createSelector([getAuth], (auth) => auth.refreshToken);
export const getUser = createSelector([getAuth], (auth) => auth.user);
export const getUserId = createSelector([getUser], (user) => user.id);

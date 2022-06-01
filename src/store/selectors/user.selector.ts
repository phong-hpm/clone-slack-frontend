import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

const getAuth = (state: RootState) => state.auth;

const isAuth = createSelector([getAuth], (auth) => auth.isAuth);
const isLoading = createSelector([getAuth], (auth) => auth.isLoading);

const getAccessToken = createSelector([getAuth], (auth) => auth.accessToken);
const getRefreshToken = createSelector([getAuth], (auth) => auth.refreshToken);
const getEmailVerifying = createSelector([getAuth], (auth) => auth.emailVerifying);
const getUser = createSelector([getAuth], (auth) => auth.user);
const getUserId = createSelector([getUser], (user) => user.id);

const getTestState = createSelector([getAuth], (auth: any) => auth.testState);

const userSelectors = {
  isAuth,
  isLoading,
  getAccessToken,
  getRefreshToken,
  getEmailVerifying,
  getUser,
  getUserId,
  getTestState,
};

export default userSelectors;

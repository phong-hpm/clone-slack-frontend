import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

const getUserState = (state: RootState) => state.user;

const isAuth = createSelector([getUserState], (auth) => auth.isAuth);
const isLoading = createSelector([getUserState], (auth) => auth.isLoading);

const getAccessToken = createSelector([getUserState], (auth) => auth.accessToken);
const getRefreshToken = createSelector([getUserState], (auth) => auth.refreshToken);
const getEmailVerifying = createSelector([getUserState], (auth) => auth.emailVerifying);
const getUser = createSelector([getUserState], (auth) => auth.user);
const getUserId = createSelector([getUser], (user) => user.id);

const userSelectors = {
  isAuth,
  isLoading,
  getAccessToken,
  getRefreshToken,
  getEmailVerifying,
  getUser,
  getUserId,
};

export default userSelectors;

// types
import { RootState } from "store/_types";

const userSelectors = {
  isAuth: (state: RootState) => state.user.isAuth,
  isLoading: (state: RootState) => state.user.isLoading,
  getAccessToken: (state: RootState) => state.user.accessToken,
  getRefreshToken: (state: RootState) => state.user.refreshToken,
  getEmailVerifying: (state: RootState) => state.user.emailVerifying,
  getUser: (state: RootState) => state.user.user,
  getUserId: (state: RootState) => state.user.user.id,
};

export default userSelectors;

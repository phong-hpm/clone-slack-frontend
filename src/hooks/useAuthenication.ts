import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// redux store
import { useDispatch, useSelector } from "store";

// redux actions
import { renewAccessToken } from "store/actions/user/renewToken";
import { getUserInformation } from "store/actions/user/getUserInformation";

// redux selectors
import userSelectors from "store/selectors/user.selector";
import teamsSelectors from "store/selectors/teams.selector";

// utils
import { routePaths } from "utils/constants";

const useAuthenication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = useSelector(userSelectors.getAccessToken);
  const refreshToken = useSelector(userSelectors.getRefreshToken);
  const isTeamWaiting = useSelector(teamsSelectors.isWaiting);

  const [isRendered, setRendered] = useState(false);

  // revent initiation component
  useEffect(() => {
    if (!isRendered) setRendered(true);
  }, [isRendered]);

  // if refresh token is empty,
  // then user will need to login
  useEffect(() => {
    if (isRendered && !refreshToken) navigate(routePaths.SIGNIN_PAGE);
  }, [isRendered, refreshToken, navigate]);

  // if access token is empty but refresh token has value,
  // then user will get new access token
  useEffect(() => {
    if (isRendered && refreshToken && !accessToken) dispatch(renewAccessToken());
  }, [isRendered, accessToken, refreshToken, dispatch]);

  // if access token and refresh token have value,
  // then user will get user information
  useEffect(() => {
    if (isRendered && isTeamWaiting && refreshToken && accessToken) {
      dispatch(getUserInformation());
    }
  }, [isRendered, isTeamWaiting, accessToken, refreshToken, dispatch]);
};

export default useAuthenication;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// redux store
import { useDispatch, useSelector } from "../store";

// redux actions
import { getUserInformation } from "../store/actions/auth/getUserInformation";
import { renewAccessToken } from "../store/actions/auth/renewToken";

// redux selectors
import * as authSelectors from "../store/selectors/auth.selector";

// utils
import { RouterPath } from "../utils/constants";

const useAuthenication = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const accessToken = useSelector(authSelectors.getAccessToken);
  const refreshToken = useSelector(authSelectors.getRefreshToken);

  const [isRendered, setRendered] = useState(false);

  // revent initiation component
  useEffect(() => {
    if (!isRendered) setRendered(true);
  }, [isRendered]);

  // if refresh token is empty,
  // then user will need to login
  useEffect(() => {
    if (isRendered && !refreshToken) navigate(RouterPath.LOGIN_PAGE);
  }, [isRendered, refreshToken, navigate]);

  // if access token is empty but refresh token has value,
  // then user will get new access token
  useEffect(() => {
    if (isRendered && refreshToken && !accessToken) dispatch(renewAccessToken());
  }, [isRendered, accessToken, refreshToken, dispatch]);

  // if access token and refresh token have value,
  // then user will get user information
  useEffect(() => {
    if (isRendered && refreshToken && accessToken) {
      dispatch(getUserInformation());
    }
  }, [isRendered, accessToken, refreshToken, dispatch]);
};

export default useAuthenication;

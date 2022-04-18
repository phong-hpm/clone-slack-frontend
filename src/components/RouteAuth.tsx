import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthenication from "../hooks/useAuthenication";

import { useSelector } from "../store";
import * as authSelectors from "../store/selectors/auth.selector";

export interface RouteAuthProps {
  children: JSX.Element;
}

const RouteAuth: FC<RouteAuthProps> = ({ children }) => {
  useAuthenication();
  const navigate = useNavigate();

  const isAuth = useSelector(authSelectors.isAuth);
  const isVerified = useSelector(authSelectors.isVerified);
  const isLoading = useSelector(authSelectors.isLoading);

  useEffect(() => {
    if (isVerified && !isAuth && !isLoading) navigate("/login");
  }, [isAuth, isVerified, isLoading, navigate]);

  return children;
};

export default RouteAuth;

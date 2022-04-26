import { FC } from "react";

// redux store
import { useSelector } from "../store";

// redux selectors
import * as authSelectors from "../store/selectors/auth.selector";

// hooks
import useAuthenication from "../hooks/useAuthenication";

// pages
import LoadingPage from "../pages/LoadingPage";

export interface RouteAuthProps {
  children: JSX.Element;
}

const RouteAuth: FC<RouteAuthProps> = ({ children }) => {
  useAuthenication();
  const isAuth = useSelector(authSelectors.isAuth);

  if (!isAuth) return <LoadingPage />;

  return children;
};

export default RouteAuth;

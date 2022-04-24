import { FC } from "react";

// hooks
import useAuthenication from "../hooks/useAuthenication";

export interface RouteAuthProps {
  children: JSX.Element;
}

const RouteAuth: FC<RouteAuthProps> = ({ children }) => {
  useAuthenication();

  return children;
};

export default RouteAuth;

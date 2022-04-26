import { FC } from "react";
import { BrowserRouter, Routes as RoutesBase, Route } from "react-router-dom";

// pages
import Login from "../pages/LoginPage";
import Home from "../pages/HomePage";
import ChatPage from "../pages/ChatPage";
import TeamPage from "../pages/TeamPage";

// components
import RouteAuth from "../components/RouteAuth";

// utils
import { RouterPath } from "../utils/constants";

const Routes: FC = () => {
  return (
    <BrowserRouter>
      <RoutesBase>
        <Route path={RouterPath.LOGIN_PAGE} element={<Login />} />
        <Route
          path={RouterPath.TEAM_PAGE}
          element={
            <RouteAuth>
              <TeamPage />
            </RouteAuth>
          }
        />
        <Route
          path="/:teamId/*"
          element={
            <RouteAuth>
              <ChatPage />
            </RouteAuth>
          }
        />
        <Route path="/" element={<Home />} />
      </RoutesBase>
    </BrowserRouter>
  );
};

export default Routes;

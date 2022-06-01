import { FC } from "react";
import { BrowserRouter, Routes as RoutesBase, Route } from "react-router-dom";

// pages
import NotFoundPage from "pages/NotFoundPage";
import Home from "pages/HomePage";
import AccountWrapper from "pages/AccountPage/AccountWrapper";
import SignUp from "pages/AccountPage/Signup";
import Signin from "pages/AccountPage/Signin";
import ConfirmCode from "pages/AccountPage/ConfirmCode";
import ChatPage from "pages/ChatPage";
import TeamList from "pages/AccountPage/TeamList";

// components
import RouteAuth from "features/RouteAuth";

// utils
import { routePaths } from "utils/constants";

const Routes: FC = () => {
  return (
    <BrowserRouter>
      <RoutesBase>
        <Route path={routePaths.HOME_PAGE} element={<Home />} />
        <Route path={routePaths.SIGNIN_PAGE} element={<AccountWrapper children={<Signin />} />} />
        <Route path={routePaths.SIGNUP_PAGE} element={<AccountWrapper children={<SignUp />} />} />
        <Route
          path={routePaths.CONFIRM_CODE_PAGE}
          element={<AccountWrapper children={<ConfirmCode />} />}
        />
        <Route
          path={routePaths.TEAM_PAGE}
          element={<RouteAuth children={<AccountWrapper children={<TeamList />} />} />}
        />
        <Route
          path={`${routePaths.CHATBOX_PAGE}/:teamId/*`}
          element={<RouteAuth children={<ChatPage />} />}
        />
        <Route path="/*" element={<NotFoundPage />} />
      </RoutesBase>
    </BrowserRouter>
  );
};

export default Routes;

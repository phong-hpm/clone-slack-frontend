import { FC } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import "./App.scss";

import Login from "./pages/LoginPage";
import Home from "./pages/HomePage";
import ChatPage, { ValidateTeamPath } from "./pages/Main";
import TeamPage from "./pages/TeamPage";

import RouteAuth from "./components/RouteAuth";

import { store } from "./store";
import { RouterPath } from "./utils/constants";

const MainRoute: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
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
              <ValidateTeamPath>
                <ChatPage />
              </ValidateTeamPath>
            </RouteAuth>
          }
        />
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
};

const App: FC = () => {
  return (
    <div className="App">
      <Provider store={store}>
        <MainRoute />
      </Provider>
    </div>
  );
};

export default App;

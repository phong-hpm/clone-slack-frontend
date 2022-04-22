import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";

import "./App.scss";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Team from "./pages/Main/Teams";

import RouteAuth from "./components/RouteAuth";

import { store } from "./store";
import { FC } from "react";

const MainRoute: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/:teamId/*"
          element={
            <RouteAuth>
              <Team />
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

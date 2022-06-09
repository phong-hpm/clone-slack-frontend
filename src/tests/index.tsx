import React, { FC, ReactElement } from "react";
import { createMemoryHistory } from "history";
import { render, RenderOptions } from "@testing-library/react";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import MockAdapter from "axios-mock-adapter";

// redux store
import { setupStore } from "store";

// utils
import axiosInstance from "utils/axios";

export const mockAxios = new MockAdapter(axiosInstance, { onNoMatch: "throwException" });
export let store = setupStore();
export const history = createMemoryHistory();

// this callback will be fired on each test suite
// test suite = test file
beforeAll(() => {
  mockAxios.reset();
});

beforeEach(() => {
  // reset store before render
  store = setupStore();
});

const AllTheProviders: FC = ({ children }) => {
  return (
    <Provider store={store}>
      <Router location={history.location} navigator={history}>
        {children}
      </Router>
    </Provider>
  );
};

const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => {
  const wrapper = render(ui, { wrapper: AllTheProviders, ...options });
  return wrapper;
};

export * from "@testing-library/react";
export { customRender };

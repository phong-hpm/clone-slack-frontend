import { screen } from "@testing-library/react";

// components
import LoadingWrapper from "components/LoadingWrapper";

// utils
import { customRender } from "tests";

describe("Test render", () => {
  test("When not loading", () => {
    customRender(
      <LoadingWrapper isLoading={false}>
        <div data-testid="children" />
      </LoadingWrapper>
    );

    expect(screen.getByTestId("children")).toBeInTheDocument();
    expect(screen.getByTestId("children").nextSibling).toBeNull();
  });

  test("When loading", () => {
    customRender(
      <LoadingWrapper isLoading={true}>
        <div data-testid="children" />
      </LoadingWrapper>
    );

    expect(screen.getByTestId("children")).toBeInTheDocument();
    expect(screen.getByTestId("children").nextSibling).toBeInTheDocument();
  });
});

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import FieldGroup from "components/FieldGroup";

// utils
import { customRender } from "__tests__/__setups__";

// FieldGroup is styling via MuiProps, we can't test it's styles
// FieldGroup doesn't control data, so we try to write test for coverage only
describe("Test render", () => {
  test("Render for coverage", () => {
    customRender(<FieldGroup isGroupHead isGroupBody isGroupFooter imageSrc="src" />);
  });
});

describe("Test actions", () => {
  test("Click on group", () => {
    const mockClick = jest.fn();
    customRender(<FieldGroup data-testid="FieldGroup" onClick={mockClick} />);

    userEvent.click(screen.getByTestId("FieldGroup"));
    expect(mockClick).toBeCalledWith(expect.objectContaining({ type: "click" }));
  });
});

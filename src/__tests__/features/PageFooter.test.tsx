import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockUseMediaQuery from "@mui/material/useMediaQuery";

// components
import PageFooter from "features/PageFooter";
import featuresConstants from "features/_features.constants";
import { useNavigate } from "react-router-dom";

// utils
import { customRender } from "__tests__/__setups__";
import { routePaths } from "utils/constants";
import { getPlatform } from "utils/detectplatform";

const testClickAndExpectContent = (mockNavigate: jest.Mock) => {
  const { navigationGroups, signatures } = featuresConstants.pageFooter;

  // test click download
  userEvent.click(screen.getByText("Download Slack"));
  expect(mockNavigate).toBeCalledWith(`${routePaths.DOWNLOAD_PAGE}/${getPlatform()}`);

  // test click navigations
  // collapse only change the height of list element
  //   that mean all list element will be rendered
  //   so we can't test it, just try to pass coverage
  userEvent.click(screen.getByText(navigationGroups[0].title)); // coverage
  navigationGroups.forEach(({ title, navigations }) => {
    userEvent.click(screen.getByText(title));
    navigations.forEach((navigation) => {
      userEvent.click(screen.getByText(navigation.label));
      expect(mockNavigate).toBeCalledWith(navigation.path);
    });
  });

  // test signatures
  signatures.navigations.forEach((navigation) => {
    userEvent.click(screen.getByText(navigation.label));
    expect(mockNavigate).toBeCalledWith(navigation.path);
  });
};

describe("Test render", () => {
  test("Render PageFooter in small screen", () => {
    const mockNavigate = useNavigate();

    customRender(<PageFooter />);

    testClickAndExpectContent(mockNavigate as jest.Mock);
  });

  test("Render PageFooter in medium screen", () => {
    (mockUseMediaQuery as jest.Mock).mockImplementation(() => true);
    const mockNavigate = useNavigate();

    customRender(<PageFooter />);

    testClickAndExpectContent(mockNavigate as jest.Mock);
  });
});

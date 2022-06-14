// components
import SlackIcon from "components/SlackIcon";

// utils
import { customRender } from "__tests__/__setups__";

describe("Test render", () => {
  test("When icon is image", () => {
    customRender(<SlackIcon icon="close" fontSize="small" isSpinner />);

    expect(document.getElementsByTagName("span")[0]).toBeInTheDocument();
    expect(document.getElementsByTagName("i")[0]).toBeUndefined();
  });

  test("When icon is fontIcon", () => {
    customRender(<SlackIcon icon="search" fontSize="small" isSpinner />);

    expect(document.getElementsByTagName("span")[0]).toBeUndefined();
    expect(document.getElementsByTagName("i")[0]).toBeInTheDocument();
  });
});

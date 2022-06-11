// components
import Status from "components/Status";

// utils
import { customRender } from "tests";
import { color } from "utils/constants";

describe("Test render", () => {
  test("When online", () => {
    customRender(<Status isOnline />);

    expect(document.getElementsByTagName("i")[0]).toHaveStyle({ color: color.SUCCESS });
  });

  test("When offine", () => {
    customRender(<Status isOnline={false} />);

    expect(document.getElementsByTagName("i")[0]).toHaveStyle({ color: color.MAX_SOLID });
  });
});

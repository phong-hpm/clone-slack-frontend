// components
import SvgFileIcon from "components/SvgFileIcon";

// utils
import { customRender } from "__tests__/__setups__";

describe("Test render", () => {
  test("When icon does not exist", () => {
    customRender(<SvgFileIcon icon={"wrong-icon" as any} />);

    expect(document.getElementsByTagName("svg")[0]).toBeUndefined();
  });

  test("When icon does not exist", () => {
    customRender(<SvgFileIcon icon="search" />);

    expect(document.getElementsByTagName("svg")[0]).toBeInTheDocument();
  });
});

import { fireEvent } from "@testing-library/react";

// components
import Image from "components/Image";

// utils
import { customRender } from "tests";

describe("Test render", () => {
  test("When has no ratio prop", () => {
    customRender(<Image />);

    const imgageEl = document.getElementsByTagName("img")[0];
    expect(imgageEl).toBeInTheDocument();
    expect(imgageEl).toHaveStyle({ position: "inherit" });
  });

  test("When has ratio prop", () => {
    customRender(<Image ratio={9 / 16} />);

    const imgageEl = document.getElementsByTagName("img")[0];
    expect(imgageEl).toBeInTheDocument();
    expect(imgageEl).toHaveStyle({ position: "absolute" });
  });

  test("When image is loading", () => {
    customRender(<Image />);

    const imgageEl = document.getElementsByTagName("img")[0];

    expect(imgageEl).toHaveStyle({
      top: "-1px",
      left: "-1px",
      width: "calc(100% + 2px)",
      height: "calc(100% + 2px)",
    });
  });

  test("When image was loaded success", () => {
    customRender(<Image />);

    const imgageEl = document.getElementsByTagName("img")[0];
    fireEvent.load(imgageEl);

    expect(imgageEl).toHaveStyle({ top: "0", left: "0", width: "100%", height: "100%" });
  });

  test("When image was loaded fail", () => {
    customRender(<Image />);

    const imgageEl = document.getElementsByTagName("img")[0];
    fireEvent.error(imgageEl);

    expect(imgageEl).toHaveStyle({ display: "none" });
  });
});

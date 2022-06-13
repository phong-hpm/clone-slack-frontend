import { screen, render } from "@testing-library/react";

// components
import Bookmark from "../Bookmark";

describe("Test render", () => {
  test("When not starred", () => {
    render(<Bookmark isStarred={false} />);

    expect(screen.queryByText("Added to your saved items")).toBeNull();
  });

  test("When not starred", () => {
    render(<Bookmark isStarred={true} />);

    expect(screen.getByText("Added to your saved items")).toBeInTheDocument();
  });
});

import { screen } from "@testing-library/react";

// components
import EmojiIcon from "../EmojiIcon";

// utils
import { customRender } from "tests";

describe("Test render", () => {
  test("Render with rong id", () => {
    customRender(<EmojiIcon id="wrong-id" fontSize="small" />);

    expect(document.getElementsByTagName("span")[0]).toHaveTextContent("");
  });

  test("Render with id", () => {
    customRender(<EmojiIcon id="white_check_mark" fontSize="small" />);

    expect(screen.getByText("✅")).toBeInTheDocument();
  });
});

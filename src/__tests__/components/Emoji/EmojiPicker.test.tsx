import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import EmojiPicker from "components/Emoji/EmojiPicker";

// utils
import { customRender } from "__tests__/__setups__";

describe("Test render", () => {
  test("Render EmojiPicker", () => {
    customRender(<EmojiPicker onEmojiSelect={() => {}} />);

    expect(screen.getByTestId("Picker")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Select emoji icon", () => {
    const mockOnEmojiSelect = jest.fn();
    customRender(<EmojiPicker onEmojiSelect={mockOnEmojiSelect} />);

    userEvent.click(screen.getByTestId("click-white_check_mark"));
    expect(mockOnEmojiSelect).toBeCalledWith({
      id: "white_check_mark",
      keywords: [],
      name: "Check Mark Button",
      native: "✅",
      shortcodes: ":white_check_mark:",
      unified: "2705",
    });
  });
});

import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import EmojiModal from "features/EmojiModal";

// utils
import { customRender } from "tests";

jest.mock(
  "components/Emoji/EmojiPicker",
  () =>
    ({ onEmojiSelect }: { onEmojiSelect: (emoji: { id: string }) => void }) =>
      (
        <div data-testid="EmojiPicker">
          <div
            data-testid="trigger-emoji-select"
            onClick={() => onEmojiSelect({ id: "emojiId" })}
          />
        </div>
      )
);

describe("Test render", () => {
  test("Render EmojiModal", () => {
    customRender(<EmojiModal isOpen={true} onEmojiSelect={() => {}} onClose={() => {}} />);

    expect(screen.getByText("Loading emoji picker...")).toBeInTheDocument();
    expect(screen.getByTestId("EmojiPicker")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("select emoji", () => {
    const mockEmojiSelect = jest.fn();
    const mockClose = jest.fn();
    customRender(<EmojiModal isOpen={true} onEmojiSelect={mockEmojiSelect} onClose={mockClose} />);

    userEvent.click(screen.getByTestId("trigger-emoji-select"));
    expect(mockEmojiSelect).toBeCalledWith({ id: "emojiId" });
    expect(mockClose).toBeCalled();
  });
});

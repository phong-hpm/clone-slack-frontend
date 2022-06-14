import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import PlayerProgressBar from "components/MediaPlayer/VideoPlayer/Controls/PlayerProgressBar";

jest.mock(
  "@mui/material/Slider",
  () =>
    ({ onChange }: { onChange: (e: any, n: number) => void }) => {
      return (
        <div data-testid="Slider">
          <div data-testid="trigger-onChange" onClick={() => onChange({}, 10)}></div>
        </div>
      );
    }
);

describe("Test actions", () => {
  test("Change duration", () => {
    const mockOnChange = jest.fn();
    render(<PlayerProgressBar onChange={mockOnChange} />);

    userEvent.click(screen.getByTestId("trigger-onChange"));
    expect(mockOnChange).toBeCalledWith(10);
  });
});

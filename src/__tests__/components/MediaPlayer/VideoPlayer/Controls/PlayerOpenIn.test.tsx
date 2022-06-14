import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import PlayerOpenIn from "components/MediaPlayer/VideoPlayer/Controls/PlayerOpenIn";

describe("Test render", () => {
  test("Render PlayerOpenIn", () => {
    render(<PlayerOpenIn />);

    userEvent.hover(screen.getByRole("button"));
    expect(screen.getByLabelText("Open in...")).toBeInTheDocument();
  });
});

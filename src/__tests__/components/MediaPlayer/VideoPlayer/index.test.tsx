import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import MediaPlayer from "components/MediaPlayer/VideoPlayer";

describe("Test actions", () => {
  test("Test show/hide modal", () => {
    render(<MediaPlayer data={{ src: "http://example.com" }} />);

    // hover to show controls
    const videoEl = document.getElementsByTagName("video")[0];
    userEvent.hover(videoEl.parentElement?.nextSibling as HTMLDivElement);
    // click expand
    userEvent.click(screen.getByLabelText("Expand"));
    expect(screen.queryByLabelText("Expand")).toBeNull();

    // press esc to hide modal
    userEvent.keyboard("{esc}");
    expect(screen.getByLabelText("Expand")).toBeInTheDocument();
  });
});

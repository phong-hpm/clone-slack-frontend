import { screen, render, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import SelectThumnailModal from "components/MediaPlayer/SelectThumbnailModal";

// utils
import * as videoRecorder from "utils/videoRecorder";

const thumbList = ["http://example.com/created_thumb_1", "http://example.com/created_thumb_2"];

beforeEach(() => {
  jest
    .spyOn(videoRecorder, "createThumbnails")
    .mockImplementation(() => Promise.resolve(thumbList));
});

describe("Test render", () => {
  test("When can get thumbnail from video", async () => {
    render(<SelectThumnailModal isOpen src="http://example.com" onClose={() => {}} />);

    const mainImageEl = document.getElementsByTagName("img")[0];

    await waitFor(() => {
      expect(mainImageEl.src).toEqual("http://example.com/created_thumb_1");
      expect(document.getElementsByTagName("img")).toHaveLength(3);
    });
  });

  test("When can NOT get thumbnail from video", async () => {
    jest.spyOn(videoRecorder, "createThumbnails").mockImplementation(() => Promise.resolve([]));
    render(<SelectThumnailModal isOpen src="http://example.com" onClose={() => {}} />);

    const mainImageEl = document.getElementsByTagName("img")[0];

    await waitFor(() => {
      expect(mainImageEl.src).toEqual("");
      expect(document.getElementsByTagName("img")).toHaveLength(1);
    });
  });
});

describe("Test actions", () => {
  test("Select thumbnail", () => {
    render(
      <SelectThumnailModal
        isOpen
        src="http://example.com"
        thumb="http://example.com/thumb"
        thumbList={thumbList}
        onClose={() => {}}
      />
    );

    const mainImageEl = document.getElementsByTagName("img")[0];
    expect(mainImageEl.src).toEqual("http://example.com/thumb");

    // Click on the first thumb
    userEvent.click(document.getElementsByTagName("img")[1]);
    expect(mainImageEl.src).toEqual(thumbList[0]);

    // Click on the last thumb
    userEvent.click(document.getElementsByTagName("img")[thumbList.length]);
    expect(mainImageEl.src).toEqual(thumbList[thumbList.length - 1]);
  });

  test("Click submit", () => {
    const mockOnSelect = jest.fn();
    const mockOnClose = jest.fn();
    render(
      <SelectThumnailModal
        isOpen
        src="http://example.com"
        thumb="http://example.com/thumb"
        thumbList={thumbList}
        onSelect={mockOnSelect}
        onClose={mockOnClose}
      />
    );

    // click select
    userEvent.click(screen.getByText("Select"));
    expect(mockOnSelect).toBeCalledWith("http://example.com/thumb");
    expect(mockOnClose).toBeCalledWith();
  });
});

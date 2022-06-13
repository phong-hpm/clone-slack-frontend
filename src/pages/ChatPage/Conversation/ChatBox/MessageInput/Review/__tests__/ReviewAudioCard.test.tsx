import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import ReviewAudioCard, { ReviewAudioCardProps } from "../ReviewAudioCard";

jest.mock("components/MediaPlayer/AudioPlayer", () => () => <div data-testid="AudioPlayer" />);

const renderComponent = (props?: Partial<ReviewAudioCardProps>) => {
  return render(
    <ReviewAudioCard
      boxProps={{ "data-testid": "ReviewAudioCard" } as any}
      data={{ src: "http://example.com", duration: 75 }}
      {...props}
    />
  );
};

describe("Test actions", () => {
  test("Click remove button", () => {
    const mockOnRemove = jest.fn();

    renderComponent({ onRemove: mockOnRemove });

    expect(screen.getByTestId("AudioPlayer")).toBeInTheDocument();

    userEvent.hover(screen.getByTestId("ReviewAudioCard"));
    userEvent.click(screen.getByRole("button"));
    userEvent.unhover(screen.getByTestId("ReviewAudioCard"));
    expect(mockOnRemove).toBeCalledWith(expect.objectContaining({ type: "click" }));
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import ReviewVideoCard, { ReviewVideoCardProps } from "../ReviewVideoCard";

// types
import { ReviewVideoProps } from "../ReviewVideo";

jest.mock("components/SlackIcon", () => ({ icon }: { icon: string }) => (
  <div data-testid="SlackIcon">{icon}</div>
));

jest.mock("../ReviewVideo", () => (props: ReviewVideoProps) => (
  <div data-testid="ReviewVideo">
    <div data-testid="fire-onClose" onClick={() => props.onClose()} />
  </div>
));

const renderComponent = (props?: Partial<ReviewVideoCardProps>) => {
  return render(
    <ReviewVideoCard
      boxProps={{ "data-testid": "ReviewVideoCard" } as any}
      file={{
        id: "id",
        type: "video",
        url: "http://example.com",
        duration: 75,
        mineType: "video/webm",
        createdTime: Date.now(),
        thumb: "http://example.com/thumb",
      }}
      {...props}
    />
  );
};

describe("Test actions", () => {
  test("Click remove button", () => {
    const mockOnRemove = jest.fn();

    renderComponent({ onRemove: mockOnRemove });

    userEvent.hover(screen.getByTestId("ReviewVideoCard"));
    userEvent.click(screen.getByRole("button"));
    userEvent.unhover(screen.getByTestId("ReviewVideoCard"));
    expect(mockOnRemove).toBeCalledWith(expect.objectContaining({ type: "click" }));
  });

  test("Click play button", () => {
    renderComponent();

    userEvent.click(screen.getByText("play-filled"));
    expect(screen.getByTestId("ReviewVideo")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("fire-onClose"));
    expect(screen.queryByTestId("ReviewVideo")).toBeNull();
  });
});

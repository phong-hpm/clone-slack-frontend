import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import ReviewImageCard, {
  ReviewImageCardProps,
} from "pages/ChatPage/Conversation/ChatBox/MessageInput/Review/ReviewImageCard";
import { ReviewImageModalProps } from "pages/ChatPage/Conversation/ChatBox/MessageInput/Review/ReviewImageModal";

jest.mock("components/Image", () => () => <div data-testid="Image" />);

const renderComponent = (props?: Partial<ReviewImageCardProps>) => {
  return render(
    <ReviewImageCard
      boxProps={{ "data-testid": "ReviewImageCard" } as any}
      src="http://example.com"
      {...props}
    />
  );
};

jest.mock(
  "pages/ChatPage/Conversation/ChatBox/MessageInput/Review/ReviewImageModal",
  () => (props: ReviewImageModalProps) =>
    (
      <div data-testid="ReviewImageModal">
        <div data-testid="fire-onClose" onClick={() => props.onClose()} />
      </div>
    )
);

describe("Test actions", () => {
  test("Click remove button", () => {
    const mockOnRemove = jest.fn();

    renderComponent({ onRemove: mockOnRemove });

    expect(screen.getByTestId("Image")).toBeInTheDocument();

    userEvent.hover(screen.getByTestId("ReviewImageCard"));
    userEvent.click(screen.getByRole("button"));
    userEvent.unhover(screen.getByTestId("ReviewImageCard"));
    expect(mockOnRemove).toBeCalledWith(expect.objectContaining({ type: "click" }));
  });

  test("Click on image", () => {
    renderComponent();

    userEvent.click(screen.getByTestId("Image"));
    expect(screen.getByTestId("ReviewImageModal")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("fire-onClose"));
    expect(screen.queryByTestId("ReviewImageModal")).toBeNull();
  });
});

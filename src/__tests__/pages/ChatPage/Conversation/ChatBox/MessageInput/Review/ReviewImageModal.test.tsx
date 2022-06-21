import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import ReviewImageModal from "pages/ChatPage/Conversation/ChatBox/MessageInput/Review/ReviewImageModal";

// types
import { SliderProps, TooltipProps } from "@mui/material";

jest.mock("components/SlackIcon", () => ({ icon }: { icon: string }) => (
  <div data-testid="SlackIcon">{icon}</div>
));

jest.mock("@mui/material/Slider", () => ({ onChange }: SliderProps) => {
  return (
    <div data-testid="Slider">
      <div
        data-testid="trigger-onChangeProgress"
        onClick={() => onChange?.({} as any, 150, 150)}
      ></div>
    </div>
  );
});

jest.mock("@mui/material/Tooltip", () => ({ title, children }: TooltipProps) => {
  return (
    <div data-testid="Slider">
      <div>{title}</div>
      {children}
    </div>
  );
});

describe("", () => {
  test("", () => {
    render(<ReviewImageModal isOpen url="http://example.com" onClose={() => {}} />);
  });
});

describe("Test actions", () => {
  test("Click rotate", () => {
    render(<ReviewImageModal isOpen url="http://example.com" onClose={() => {}} />);

    const imageEl = document.getElementsByTagName("img")[0];
    expect(imageEl).toHaveStyle({ maxWidth: "100%", maxHeight: "100%", transform: "rotate(0deg)" });

    userEvent.click(screen.getByText("repeat"));
    expect(imageEl).toHaveStyle({
      maxWidth: "100%",
      maxHeight: "100%",
      transform: "rotate(90deg)",
    });
  });

  test("Click zoom", () => {
    render(<ReviewImageModal isOpen url="http://example.com" onClose={() => {}} />);

    const imageEl = document.getElementsByTagName("img")[0];
    expect(imageEl).toHaveStyle({ maxWidth: "100%", maxHeight: "100%", transform: "rotate(0deg)" });

    userEvent.click(screen.getByTestId("trigger-onChangeProgress"));
    expect(imageEl).toHaveStyle({ maxWidth: "150%", maxHeight: "150%", transform: "rotate(0deg)" });

    userEvent.click(screen.getByText("minus"));
    expect(imageEl).toHaveStyle({ maxWidth: "100%", maxHeight: "100%", transform: "rotate(0deg)" });

    userEvent.click(screen.getByText("plus"));
    expect(imageEl).toHaveStyle({ maxWidth: "150%", maxHeight: "150%", transform: "rotate(0deg)" });

    userEvent.click(screen.getByText("collapse-vertical"));
  });
});

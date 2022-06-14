import { screen, render } from "@testing-library/react";

// components
import MoreRemindList from "pages/ChatPage/Conversation/ChatBox/MessageActions/MoreRemindList";

describe("Test render", () => {
  test("Render MoreRemindList", () => {
    render(<MoreRemindList />);

    expect(screen.getByText("In 20 minutes")).toBeInTheDocument();
    expect(screen.getByText("In 1 hour")).toBeInTheDocument();
    expect(screen.getByText("In 3 hours")).toBeInTheDocument();
    expect(screen.getByText("Tomorrow")).toBeInTheDocument();
    expect(screen.getByText("Next week")).toBeInTheDocument();
    expect(screen.getByText("Custom...")).toBeInTheDocument();
  });
});

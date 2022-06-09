import { screen } from "@testing-library/react";
import reactRouterDom from "react-router-dom";
const { useNavigate } = reactRouterDom;

// components
import ChatPage from "..";

// utils
import { customRender } from "tests";
import { routePaths } from "utils/constants";

// We don't test these component in this file
// mocking them to increate performance
jest.mock("pages/ChatPage/WorkSpace", () => () => <div>WorkSpace</div>);
jest.mock("pages/ChatPage/Conversation", () => () => <div>Conversation</div>);
jest.mock("pages/ChatPage/ChatBar", () => () => <div>ChatBar</div>);
jest.mock("pages/ChatPage/GlobalModal", () => () => <div>GlobalModal</div>);

describe("Test render", () => {
  test("Render with wrong teamId path pattern", () => {
    const mockNavigate = useNavigate() as jest.Mock;
    jest.spyOn(reactRouterDom, "useParams").mockImplementation(() => ({ teamId: "wrong" }));

    customRender(<ChatPage />);
    expect(mockNavigate).toBeCalledWith(routePaths.TEAM_PAGE);

    expect(screen.queryByText("WorkSpace")).toBeNull();
    expect(screen.queryByText("Conversation")).toBeNull();
    expect(screen.queryByText("ChatBar")).toBeNull();
    expect(screen.queryByText("GlobalModal")).toBeNull();
  });

  test("Render with wrong channelId path pattern", () => {
    jest
      .spyOn(reactRouterDom, "useParams")
      .mockImplementation(() => ({ teamId: "T-123456789", "*": "wrong" }));

    customRender(<ChatPage />);

    expect(screen.getByText("WorkSpace")).toBeInTheDocument();
    expect(screen.getByText("Conversation")).toBeInTheDocument();
    expect(screen.getByText("ChatBar")).toBeInTheDocument();
    expect(screen.getByText("GlobalModal")).toBeInTheDocument();
  });

  test("Render ChatPage", () => {
    jest
      .spyOn(reactRouterDom, "useParams")
      .mockImplementation(() => ({ teamId: "T-123456789", "*": "C-123456789" }));

    customRender(<ChatPage />);

    expect(screen.getByText("WorkSpace")).toBeInTheDocument();
    expect(screen.getByText("Conversation")).toBeInTheDocument();
    expect(screen.getByText("ChatBar")).toBeInTheDocument();
    expect(screen.getByText("GlobalModal")).toBeInTheDocument();
  });
});

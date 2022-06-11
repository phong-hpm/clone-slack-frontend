import { screen } from "@testing-library/react";

// components
import UserAvatarStatus from "components/UserAvatarStatus";

// utils
import { customRender } from "tests";

jest.mock("../Status", () => ({ isOnline }: { isOnline: boolean }) => (
  <div>Status: {isOnline ? "online" : "offline"}</div>
));

describe("Test render", () => {
  test("When online", () => {
    customRender(<UserAvatarStatus isOnline sizes="medium" />);

    expect(document.getElementsByTagName("img")[0]).toBeInTheDocument();
    expect(screen.getByText("Status: online")).toBeInTheDocument();
  });

  test("When offline", () => {
    customRender(<UserAvatarStatus isOnline={false} sizes="large" />);

    expect(document.getElementsByTagName("img")[0]).toBeInTheDocument();
    expect(screen.getByText("Status: offline")).toBeInTheDocument();
  });
});

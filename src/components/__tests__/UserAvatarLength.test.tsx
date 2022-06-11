import { screen } from "@testing-library/react";

// components
import UserAvatarLength from "components/UserAvatarLength";

// utils
import { customRender } from "tests";

describe("Test render", () => {
  test("Render UserAvatarLength", () => {
    customRender(<UserAvatarLength length={79} />);

    expect(document.getElementsByTagName("img")[0]).toBeInTheDocument();
    expect(screen.getByText("79")).toBeInTheDocument();
  });
});

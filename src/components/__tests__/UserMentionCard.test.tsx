import { screen } from "@testing-library/react";

// components
import UserMentionCard from "components/UserMentionCard";

// utils
import { customRender } from "tests";

jest.mock("../Status", () => () => <div data-testid="Status" />);

const userData = {
  id: "U-o29OsxUsn",
  name: "Phong Ho",
  realname: "Phong Ho Pham Minh",
  email: "phonghophamminh@gmail.com",
  timeZone: "",
  teams: [],
  avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
  createdTime: 1653589513216,
  updatedTime: 1653589513216,
};

describe("Test render", () => {
  test("When user is undefined", () => {
    customRender(<UserMentionCard userId={userData.id} />);

    expect(screen.queryByTestId("Status")).toBeNull();
  });

  test("When user name is empty", () => {
    customRender(<UserMentionCard userId={userData.id} userMention={{ ...userData, name: "" }} />);

    expect(screen.getByTestId("Status")).toBeInTheDocument();
    expect(screen.getByText("unknow")).toBeInTheDocument();
    expect(screen.getByText("Phong Ho Pham Minh")).toBeInTheDocument();
  });

  test("When user name has value", () => {
    customRender(<UserMentionCard userId={userData.id} userMention={userData} />);

    expect(screen.getByTestId("Status")).toBeInTheDocument();
    expect(screen.getByText("Phong Ho")).toBeInTheDocument();
    expect(screen.getByText("Phong Ho Pham Minh")).toBeInTheDocument();
  });
});

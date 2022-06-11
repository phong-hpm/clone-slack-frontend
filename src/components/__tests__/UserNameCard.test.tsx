import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import UserNameCard from "components/UserNameCard";

// utils
import { customRender } from "tests";

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
    customRender(<UserNameCard />);

    expect(screen.getByText("unknow")).toBeInTheDocument();
  });

  test("When user has value", () => {
    customRender(<UserNameCard user={userData} />);

    expect(screen.getByText("Phong Ho")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click on name", () => {
    customRender(<UserNameCard user={userData} />);

    // open Modal
    userEvent.click(screen.getByText("Phong Ho"));
    expect(screen.getByText("Set Status")).toBeInTheDocument();
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();

    // close Modal
    userEvent.keyboard("{esc}"); // coverage
    expect(screen.queryByText("Set Status")).toBeNull();
    expect(screen.queryByText("Edit Profile")).toBeNull();
  });
});

import { screen } from "@testing-library/react";

// components
import UserDetailModal from "components/UserDetailModal";

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
  test("When online", () => {
    customRender(<UserDetailModal isOpen user={userData} onClose={() => {}} />);

    expect(screen.getByText("Phong Ho")).toBeInTheDocument();
    expect(screen.getByText("Set Status")).toBeInTheDocument();
    expect(screen.getByText("Edit Profile")).toBeInTheDocument();
  });
});

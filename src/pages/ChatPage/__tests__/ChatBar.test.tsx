import reactRouterDom from "react-router-dom";

// components
import ChatBar from "../ChatBar";

// utils
import { customRender, store } from "tests";
import { setUser } from "store/slices/user.slice";

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
  test("Render ChatBar", () => {
    store.dispatch(setUser(userData));
    customRender(<ChatBar />);

    expect(document.getElementsByTagName("img")).toHaveLength(1);
  });
});

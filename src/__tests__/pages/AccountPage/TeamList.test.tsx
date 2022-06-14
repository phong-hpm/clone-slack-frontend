import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";

// components
import TeamList from "pages/AccountPage/TeamList";

// utils
import { customRender, store } from "__tests__/__setups__";
import { routePaths } from "utils/constants";
import { setTeamsList } from "store/slices/teams.slice";

const teamsData = [
  {
    id: "T-Z4ijiEVH4",
    name: "Team 1",
    channels: ["C-EM0X5NCuEZ"],
    users: ["U-HTtW5jrA7", "U-o29OsxUsn", "U-zcnTpvyLO"],
    createdTime: 1650353609201,
    updatedTime: 1654576759040,
  },
  {
    id: "T-qdDI80EIY",
    name: "Team 2",
    channels: ["C-9qpfxSJimU", "C-xVbUORYe16"],
    users: ["U-o29OsxUsn"],
    createdTime: 1650353609201,
    updatedTime: 1650353609201,
  },
];

test("When data is unset", () => {
  customRender(<TeamList />);
  expect(screen.queryByText(teamsData[0].name)).not.toBeInTheDocument();
});

test("Click on team list", () => {
  const mockNavigate = useNavigate() as jest.Mock;

  store.dispatch(setTeamsList(teamsData));
  customRender(<TeamList />);

  userEvent.click(screen.getByText(teamsData[0].name));
  userEvent.unhover(screen.getByText(teamsData[0].name)); // coverage
  expect(mockNavigate).toBeCalledWith(`${routePaths.CHATBOX_PAGE}/${teamsData[0].id}`);
  mockNavigate.mockClear();

  userEvent.click(screen.getByText(teamsData[1].name));
  expect(mockNavigate).toBeCalledWith(`${routePaths.CHATBOX_PAGE}/${teamsData[1].id}`);
});

test("Click Try a different email", () => {
  const mockNavigate = useNavigate() as jest.Mock;

  store.dispatch(setTeamsList(teamsData));
  customRender(<TeamList />);

  userEvent.click(screen.getByText("Try a different email"));
  expect(mockNavigate).toBeCalledWith(routePaths.SIGNIN_PAGE);
});

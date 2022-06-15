// store
import { setupStore } from "store";

// redux slices
import { setSelectedTeamId, setTeamsList } from "store/slices/teams.slice";

// redux selectors
import teamSelectors from "store/selectors/teams.selector";

// types
import { TeamType } from "store/slices/_types";

let store = setupStore();

const teamData: TeamType = {
  id: "T-111111",
  name: "Team 1",
  channels: [],
  users: [],
  createdTime: 1650353609201,
};

beforeEach(() => {
  store = setupStore();
  store.dispatch(setTeamsList([teamData]));
  store.dispatch(setSelectedTeamId(teamData.id));
});

describe("Test teamSelectors", () => {
  test("Test isLoading", () => {
    const data = teamSelectors.isLoading(store.getState());
    expect(data).toBeFalsy();
  });
  test("Test isWaiting", () => {
    const data = teamSelectors.isWaiting(store.getState());
    expect(data).toBeFalsy();
  });

  test("Test getSelectedTeamId", () => {
    const data = teamSelectors.getSelectedTeamId(store.getState());
    expect(data).toEqual(teamData.id);
  });

  test("Test getTeamList", () => {
    const data = teamSelectors.getTeamList(store.getState());
    expect(data).toEqual([teamData]);
  });
});

// store
import { setupStore } from "store";

// redux action
import { getUserInformation } from "store/actions/user/getUserInformation";

// utils
import { apiUrl, stateDefault } from "utils/constants";
import { mockAxios, waitFor } from "__tests__/__setups__";

// types
import { TeamType, UserType } from "store/slices/_types";

let store = setupStore();

const userData: UserType = {
  id: "U-o29OsxUsn",
  name: "Phong Ho",
  realname: "Phong Ho Pham Minh",
  email: "phonghophamminh@gmail.com",
  timeZone: "",
  avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
};

const teamData: TeamType = {
  id: "T-111111",
  name: "Team 1",
  channels: [],
  users: [],
  createdTime: 1650353609201,
};

beforeEach(() => {
  store = setupStore();
});

describe("Test getUserInformation action", () => {
  test("When successfully", async () => {
    mockAxios
      .onGet(apiUrl.auth.user)
      .reply(200, { ok: true, user: { ...userData, teams: [teamData] } });

    await waitFor(() => store.dispatch(getUserInformation()));

    await waitFor(() => {
      expect(store.getState().user.user).toEqual({ ...userData, teams: [teamData] });
      expect(store.getState().teams.list).toEqual([teamData]);
      expect(store.getState().user.isAuth).toBeTruthy();
      expect(store.getState().user.isLoading).toBeFalsy();
    });
  });

  test("When unsuccessfully", async () => {
    mockAxios.onGet(apiUrl.auth.user).reply(200, { ok: false, email: "" });

    await waitFor(() => store.dispatch(getUserInformation()));

    await waitFor(() => {
      expect(store.getState().user.user).toEqual(stateDefault.USER);
      expect(store.getState().teams.list).toEqual([]);
      expect(store.getState().user.isAuth).toBeFalsy();
      expect(store.getState().user.isLoading).toBeFalsy();
    });
  });

  test("When error", async () => {
    const email = "phonghophamminh@gmail.com";
    mockAxios.onGet(apiUrl.auth.user).reply(402);

    await waitFor(() => store.dispatch(getUserInformation()));

    await waitFor(() => {
      expect(store.getState().user.user).toEqual(stateDefault.USER);
      expect(store.getState().teams.list).toEqual([]);
      expect(store.getState().user.isAuth).toBeFalsy();
      expect(store.getState().user.isLoading).toBeFalsy();
    });
  });
});

import { searchUser } from "utils/searchUser";

const userList = [
  { name: "jack", realname: "jack joker" },
  { name: "Alex", realname: "Alexander Graham Bell" },
  { name: "Join" },
] as any;

test("searchUser", () => {
  expect(searchUser(userList, "")).toEqual(userList);

  expect(searchUser(userList, "jack")).toEqual([userList[0]]);
  expect(searchUser(userList, "Alex")).toEqual([userList[1]]);
  expect(searchUser(userList, "Join")).toEqual([userList[2]]);

  expect(searchUser(userList, "jk")).toEqual([userList[0]]);
  expect(searchUser(userList, "j j")).toEqual([userList[0]]);
  expect(searchUser(userList, "a")).toEqual([userList[0], userList[1]]);
  expect(searchUser(userList, "n")).toEqual([userList[1], userList[2]]);
});

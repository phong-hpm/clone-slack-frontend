// types
import { UserType } from "store/slices/_types";

export const searchUserMention = (userList: UserType[], search: string) => {
  const matchedUsers: UserType[] = [];
  const searchList = search.toLocaleLowerCase().split(" ");

  for (const user of userList) {
    const nameList = user.name.toLocaleLowerCase().split(" ");
    let n = 0;
    let s = 0;
    let nIdx = 0;
    let sIdx = 0;

    while (nameList[n] && searchList[s]) {
      const nameStr = nameList[n];
      const searchStr = searchList[s];
      if (!nameStr[nIdx]) {
        nIdx = 0;
        n++;
        continue;
      }

      if (!searchStr[sIdx]) {
        sIdx = 0;
        s++;
        continue;
      }

      if (searchStr[sIdx] === nameStr[nIdx]) {
        sIdx++;
        nIdx++;
      } else {
        nIdx++;
      }
    }

    // all search letters passed
    if (!searchList[s] || !searchList[s][sIdx]) matchedUsers.push(user);
  }

  return matchedUsers;
};

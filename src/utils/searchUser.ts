// types
import { UserType } from "store/slices/_types";

const searchCompare = (searchWords: string[], value: string) => {
  if (!value) return false;

  const valueWords = value.trim().toLocaleLowerCase().split(" ");
  let valueWordIndex = 0;
  let searchWordIndex = 0;
  let valueCharIndex = 0;
  let searchCharIndex = 0;

  while (valueWords[valueWordIndex] && searchWords[searchWordIndex]) {
    const valueWord = valueWords[valueWordIndex];
    const searchWord = searchWords[searchWordIndex];

    // all charactors in [valueWord] were read
    if (!valueWord[valueCharIndex]) {
      // move to the next word
      valueWordIndex++;
      // start at first charactor of new word
      valueCharIndex = 0;
      continue;
    }

    // all charactors in [searchWord] were read
    if (!searchWord[searchCharIndex]) {
      // move to the next word
      searchWordIndex++;
      // start at first charactor of new word
      searchCharIndex = 0;
      continue;
    }

    if (searchWord[searchCharIndex] === valueWord[valueCharIndex]) {
      // move to next chareactor of [searchWord] and [valueWord]
      searchCharIndex++;
      valueCharIndex++;
    } else {
      // move to next caractor of [valueWord] to re-check
      valueCharIndex++;
    }
  }
  // [searchWordIndex] was ran out of [searchWords] array -> all [searchWords] passed
  if (searchWordIndex >= searchWords.length) return true;

  // [searchWordIndex] is the last index of [searchWords] array
  if (searchWordIndex === searchWords.length - 1) {
    // there are no charactor of the last [searchWords] left
    return !searchWords[searchWordIndex][searchCharIndex];
  }
  return false;
};

export const searchUser = (userList: UserType[], search: string) => {
  if (!search?.trim()) return userList;

  const matchedUsers: UserType[] = [];
  const searchWords = search.trim().toLocaleLowerCase().split(" ");

  for (const user of userList) {
    if (searchCompare(searchWords, user.realname || "")) {
      matchedUsers.push(user);
    } else if (searchCompare(searchWords, user.name)) {
      matchedUsers.push(user);
    }
  }

  return matchedUsers;
};

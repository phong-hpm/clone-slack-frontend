import { Delta } from "quill";
import { UserType } from "../store/slices/users.slice";

export const updateReadonlyLinkField = (delta: Delta, isReadOnly: boolean) => {
  const ops = delta.ops?.map((op) => {
    // link operation
    if (op.attributes?.link) {
      const { text, href } = op.attributes.link;
      return {
        ...op,
        attributes: {
          ...op.attributes,
          link: { text, href, isReadOnly },
        },
      };
    }

    return op;
  });

  return { ...delta, ops } as Delta;
};

export const addNecessaryFields = (delta: Delta, userList: UserType[], id: string) => {
  const ops = delta.ops?.map((op) => {
    // link operation
    if (op.attributes?.link) {
      const { text, href } = op.attributes.link;
      return {
        ...op,
        attributes: {
          ...op.attributes,
          link: { text, href, isReadOnly: true },
        },
      };
    }

    // mention operation
    if (op?.insert?.mention?.id) {
      const user = userList.find((usr) => usr.id === op.insert.mention.id);

      if (!user) return op;
      return {
        ...op,
        insert: {
          ...op.insert,
          mention: {
            ...op.insert.mention,
            denotationChar: "@",
            name: user.name,
            email: user.email,
            realname: user.realname,
            value: user.name,
            isOwner: !!id && op?.insert?.mention.id === id, // add mention owner
            isReadOnly: true,
          },
        },
      };
    }

    return op;
  });

  return { ...delta, ops } as Delta;
};

export const removeUnnecessaryFields = (delta: Delta) => {
  // remove empty line from start and end of ops;
  let ops: Delta["ops"] = [];

  // remove un-use fields
  ops = delta.ops?.map((op) => {
    // link operation
    if (op.attributes?.link) {
      const { text, href } = op.attributes.link;
      return {
        ...op,
        attributes: {
          ...op.attributes,
          link: { text, href },
        },
      };
    }

    // mention operation
    if (op?.insert?.mention) {
      return {
        ...op,
        insert: {
          ...op.insert,
          mention: { id: op.insert.mention.id },
        },
      };
    }

    return op;
  });

  return { ...delta, ops } as Delta;
};

import { Delta } from "quill";
import { ContextLinkValueType } from "pages/ChatPage/Conversation/ChatBox/MessageInput/_types";

// types
import { UserType } from "store/slices/_types";

export const updateEditableLinkField = (delta: Delta, isEditable: boolean) => {
  const ops = delta.ops?.map((op) => {
    // link operation
    if (op.attributes?.link) {
      const { text, href } = op.attributes.link;
      return {
        ...op,
        attributes: {
          ...op.attributes,
          link: { text, href, isEditable },
        },
      };
    }

    return op;
  });

  return { ...delta, ops } as Delta;
};

export const addNecessaryFields = (delta: Delta, userList: UserType[], id: string) => {
  const ops = delta.ops?.map((op) => {
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
          link: { text, href } as ContextLinkValueType,
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

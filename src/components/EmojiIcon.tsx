import { FC, useEffect, useState } from "react";
import classnames from "classnames";

import lodashGet from "lodash.get";

// emoji data
import data from "@emoji-mart/data";

const getEmojiNative = (id: string) => {
  return lodashGet(data.emojis, `${id}.skins[0].native`);
};

export interface EmojiIconProps {
  id: string;
  fontSize?: "inherit" | "small" | "medium" | "large";
}

const EmojiIcon: FC<EmojiIconProps> = ({ id, fontSize }) => {
  const [emojiNative, setEmojiNative] = useState("");

  useEffect(() => {
    setEmojiNative(getEmojiNative(id) || "");
  }, [id]);

  return (
    <span
      data-emoji-id={id}
      className={classnames("e-icon", fontSize && `e-icon-fontsize-${fontSize}`)}
    >
      {emojiNative}
    </span>
  );
};

export default EmojiIcon;

import { FC, useEffect, useRef } from "react";

// components
import { Picker, EmojiProps } from "emoji-mart";
import { Box } from "@mui/material";

export interface EmojiIconType {
  id: string;
  name: string;
  native: string;
  shortcodes: string;
  unified: string;
  keywords: string[];
}

export interface EmojiPickerProps extends Omit<EmojiProps, "size" | "emoji"> {
  onEmojiSelect: (emoji: EmojiIconType) => void;
}

const EmojiPicker: FC<EmojiPickerProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;
    const picker = new Picker({ ...props, ref } as any) as unknown as Node;
    element.appendChild(picker);

    return () => {
      // props can be changed, and new picker will be appened
      // we have to remove current Emoji Picker before add a new one
      element.removeChild(picker);
    };
  }, [props]);

  return <Box ref={ref} className="emoji-wrapper"></Box>;
};

export default EmojiPicker;

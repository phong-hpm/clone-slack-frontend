import React, { FC, forwardRef, useContext, useImperativeHandle, useMemo, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import classnames from "classnames";

// components
import { Quill } from "react-quill";
import { Divider, Box, IconButton } from "@mui/material";
import SlackIcon, { SlackIconProps } from "../../../../../components/SlackIcon";

// context
import ChatBoxContext from "./InputContext";

const renderIconString = (icon: SlackIconProps["icon"]) =>
  ReactDOMServer.renderToString(<SlackIcon icon={icon} fontSize="medium" />);

// custom quill toolbar icons
const icons = Quill.import("ui/icons");
icons["bold"] = renderIconString("bold");
icons["italic"] = renderIconString("italic");
icons["strike"] = renderIconString("strikethrough");
icons["link"] = renderIconString("link");
icons["list"]["ordered"] = renderIconString("numbered-list");
icons["list"]["bullet"] = renderIconString("bulleted-list");
icons["blockquote"] = renderIconString("quote");
icons["code"] = renderIconString("code");
icons["code-block"] = renderIconString("code-block");

export interface InputToolbarProps {
  isFocus?: boolean;
  onClickLink: (event: React.MouseEvent) => void;
}

const InputToolbar: FC<InputToolbarProps> = ({ isFocus, onClickLink }, ref) => {
  const { setFocus } = useContext(ChatBoxContext);

  const containerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => containerRef.current);

  const toolList = useMemo(
    () => [
      { name: "bold" },
      { name: "italic" },
      { name: "strike" },
      { isDivider: true },
      { name: "link", customAction: onClickLink },
      { isDivider: true },
      { name: "list", value: "ordered" },
      { name: "list", value: "bullet" },
      { isDivider: true },
      { name: "blockquote" },
      { isDivider: true },
      { name: "code" },
      { name: "code-block" },
    ],
    [onClickLink]
  );

  return (
    <Box
      ref={containerRef}
      id="ql-toolbar"
      display="flex"
      className={classnames(isFocus && "focus")}
      onClick={() => setFocus(true)}
    >
      {toolList.map(({ name = "", customAction, isDivider, value }, index) => {
        return isDivider ? (
          <Box key={index} mx={0.5} display="flex">
            <Divider flexItem orientation="vertical" />
          </Box>
        ) : (
          <IconButton
            key={index}
            disabled={!isFocus}
            className={`ql-${name}`}
            value={value}
            onClick={customAction}
          />
        );
      })}
    </Box>
  );
};

export default forwardRef<HTMLDivElement, InputToolbarProps>(InputToolbar as any);

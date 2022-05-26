import { FC, useCallback, useRef } from "react";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

// redux store
import { useSelector } from "store";

// redux selectors
import * as messagesSelectors from "store/selectors/messages.selector";

// components
import { Box, CircularProgress, List } from "@mui/material";
import MessageContentRow from "./MessageContentRow";

// types
import { DayMessageType } from "store/slices/_types";

const MessageContentList: FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const isLoading = useSelector(messagesSelectors.isLoading);
  // using [dayMessageListLength] replace for [dayMessageList] will help reduce
  //   computing times of [VariableSizeList]
  // this is not a good idea, but it is the best way to work with {react-window}
  // when a message was updated, this [dayMessageListLength] will not be changed
  // [MessageContentList] will not re-render
  const dayMessageListLength = useSelector(messagesSelectors.getDayMessageListLength);

  // References
  const listRef = useRef<VariableSizeList<DayMessageType[]>>(null);
  const keepRef = useRef<{ rowHeights: Record<string, number> }>({ rowHeights: {} });

  // this function is very expensive
  // fire it as few as posible
  const setRowHeight = useCallback((index: number, height: number) => {
    // reduce firing times of [resetAfterIndex]
    if (keepRef.current.rowHeights[index] !== height) {
      // KEEP THIS LINE before [resetAfterIndex]
      keepRef.current.rowHeights[index] = height;
      // KEEP THIS LINE after set [rowHeights]
      listRef.current?.resetAfterIndex(index);
    }
  }, []);

  if (isLoading) {
    return (
      <Box flex="1" pb={2.5} display="flex" justifyContent="center" alignItems="end">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box ref={containerRef} flex="1" pb={2.5}>
      <List disablePadding component="div" sx={{ height: "100%" }}>
        <AutoSizer>
          {({ width, height }) => (
            <VariableSizeList
              ref={listRef}
              width={width}
              height={height}
              itemSize={(index) => keepRef.current.rowHeights[index] || 32}
              itemCount={dayMessageListLength}
            >
              {({ index, style }) => (
                <MessageContentRow setRowHeight={setRowHeight} index={index} style={style} />
              )}
            </VariableSizeList>
          )}
        </AutoSizer>
      </List>
    </Box>
  );
};

export default MessageContentList;

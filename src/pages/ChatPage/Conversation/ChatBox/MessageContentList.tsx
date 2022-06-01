import { FC, useCallback, useEffect, useRef } from "react";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

// redux store
import { useSelector } from "store";

// redux selectors
import messagesSelectors from "store/selectors/messages.selector";

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
  const dayMessageList = useSelector(messagesSelectors.getDayMessageList);

  // References
  const listRef = useRef<VariableSizeList<DayMessageType[]>>(null);
  const keepRef = useRef<{
    rowHeights: Record<string, number>;
    itemSize: number;
    isWillScrollToBottom: boolean;
    timeoutId?: NodeJS.Timer;
  }>({
    rowHeights: {},
    itemSize: 0,
    isWillScrollToBottom: true,
  });
  keepRef.current.itemSize = dayMessageList.length;

  // this function is very expensive
  // fire it as few as posible
  const setRowHeight = useCallback((index: number, height: number) => {
    clearTimeout(keepRef.current.timeoutId!);

    // reduce firing times of [resetAfterIndex]
    if (keepRef.current.rowHeights[index] !== height) {
      // KEEP THIS LINE before [resetAfterIndex]
      keepRef.current.rowHeights[index] = height;
      // KEEP THIS LINE after set [rowHeights]
      listRef.current?.resetAfterIndex(index);
    }

    if (keepRef.current.isWillScrollToBottom) {
      listRef.current?.scrollToItem(keepRef.current.itemSize, "end");

      // [setRowHeight] will be fired many times during [dayMessageList] is rendering
      //   this [setTimeout] will help to set [isWillScrollToBottom] is false
      //   if [setRowHeight] wasn't fired after 100 ms
      keepRef.current.timeoutId = setTimeout(
        () => (keepRef.current.isWillScrollToBottom = false),
        100
      );
    }
  }, []);

  // when [dayMessageList] changed, component will be re-renderd
  useEffect(() => {
    keepRef.current.isWillScrollToBottom = true;
    const handleWillScrollToBottom = () => {
      keepRef.current.isWillScrollToBottom = true;
    };

    // this event will be dispatched from anywhere
    //  it will help control allowing scroll to bottom of list
    window.addEventListener("message-list-will-scroll-to-bottom", handleWillScrollToBottom);

    return () => {
      window.removeEventListener("message-list-will-scroll-to-bottom", handleWillScrollToBottom);
    };
  }, [dayMessageList]);

  if (isLoading) {
    // when [isLoading] is true, component will be re-rendered in feature
    keepRef.current.isWillScrollToBottom = true;
    return (
      <Box flex="1" pb={2.5} display="flex" justifyContent="center" alignItems="end">
        <CircularProgress />
      </Box>
    );
  }

  // this condition will reduce [MessageContentRow]'s rendering times
  if (!dayMessageList.length) return <></>;

  return (
    <Box ref={containerRef} flex="1" pb="25px">
      <List disablePadding component="div" sx={{ height: "100%" }}>
        <AutoSizer>
          {({ width, height }) => {
            return (
              <VariableSizeList
                ref={listRef}
                direction="vertical"
                width={width}
                height={height}
                itemKey={(index, data) => data[index].day || data[index].message?.id || index}
                // 32 is height of single message without userOwner
                itemSize={(index) => keepRef.current.rowHeights[index] || 32}
                itemData={dayMessageList}
                itemCount={dayMessageList.length}
              >
                {({ index, data, style }) => {
                  return (
                    <MessageContentRow
                      dayMessage={data[index]}
                      setRowHeight={setRowHeight}
                      index={index}
                      style={style}
                    />
                  );
                }}
              </VariableSizeList>
            );
          }}
        </AutoSizer>
      </List>
    </Box>
  );
};

export default MessageContentList;

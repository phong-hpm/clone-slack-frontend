import { FC, memo, useCallback, useRef } from "react";
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
  const dayMessageList = useSelector(messagesSelectors.getDayMessageList);

  // References
  const listRef = useRef<VariableSizeList<DayMessageType[]>>(null);
  const rowHeightsRef = useRef<Record<string, number>>({});

  // this function is very expensive
  // fire it as few as posible
  const setRowHeight = useCallback((index: number, height: number) => {
    // reduce firing times of [resetAfterIndex]
    if (rowHeightsRef.current[index] !== height) {
      // KEEP THIS LINE before [resetAfterIndex]
      rowHeightsRef.current[index] = height;
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

  // this condition will reduce [MessageContentRow]'s rendering times
  if (!dayMessageList.length) return <></>;

  return (
    <Box ref={containerRef} flex="1" pb={3}>
      <List disablePadding component="div" sx={{ height: "100%", transform: "rotateX(180deg)" }}>
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
                itemSize={(index) => rowHeightsRef.current[index] || 32}
                itemData={[...dayMessageList].reverse()}
                itemCount={dayMessageList.length}
                onScroll={(e) => console.log(e.scrollDirection)}
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

export default memo(MessageContentList);

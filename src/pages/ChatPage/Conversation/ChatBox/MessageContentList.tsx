import { FC, memo, useCallback, useRef } from "react";
import { VariableSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import InfiniteLoader from "react-window-infinite-loader";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import messagesSelectors from "store/selectors/messages.selector";

// components
import { Box, CircularProgress, List } from "@mui/material";
import MessageContentRow from "./MessageContentRow";

// types
import { DayMessageType } from "store/slices/_types";
import { emitLoadMoreMessages } from "store/actions/socket/messageSocket.action";

export interface MessageContentListProps {}

const MessageContentList: FC<MessageContentListProps> = () => {
  const dispatch = useDispatch();

  const containerRef = useRef<HTMLDivElement>(null);

  const isLoading = useSelector(messagesSelectors.isLoading);
  const hasMore = useSelector(messagesSelectors.hasMore);
  const dayMessageList = useSelector(messagesSelectors.getDayMessageList);

  // References
  const rowHeightsRef = useRef<Record<string, number>>({});
  const keepRef = useRef<{
    listRef?: VariableSizeList<DayMessageType[]> | null;
    timeoutId?: NodeJS.Timer;
  }>({});

  // this function is very expensive
  // fire it as few as posible
  const setRowHeight = useCallback((index: number, height: number) => {
    // reduce firing times of [resetAfterIndex]
    if (rowHeightsRef.current[index] !== height) {
      // KEEP THIS LINE before [resetAfterIndex]
      rowHeightsRef.current[index] = height;
      // KEEP THIS LINE after set [rowHeights]
      keepRef.current.listRef?.resetAfterIndex(index);
    }
  }, []);

  // isLoading will be true when emiting load data from server
  if (isLoading) {
    return (
      <Box flex="1" pb={2.5} display="flex" justifyContent="center" alignItems="end">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box ref={containerRef} flex="1" pb={3}>
      <List disablePadding component="div" sx={{ height: "100%", transform: "rotateX(180deg)" }}>
        <AutoSizer>
          {({ width, height }) => {
            return (
              <InfiniteLoader
                isItemLoaded={(index) => index < dayMessageList.length}
                threshold={0}
                minimumBatchSize={10}
                itemCount={dayMessageList.length + (hasMore ? 1 : 0)}
                loadMoreItems={() => {
                  dispatch(emitLoadMoreMessages({ limit: 10 }));
                }}
              >
                {({ ref: setListRef, onItemsRendered }) => {
                  return (
                    <VariableSizeList
                      ref={(ref) => {
                        setListRef(ref);
                        keepRef.current.listRef = ref;
                      }}
                      width={width}
                      height={height}
                      itemKey={(index, data) =>
                        data[index]?.day || data[index]?.message?.id || index
                      }
                      // 32 is height of single message without userOwner
                      itemSize={(index) => rowHeightsRef.current[index] || 32}
                      itemData={[...dayMessageList].reverse()}
                      // (+ 1) to render 1 more row, which will display [loading] or [panel]
                      itemCount={dayMessageList.length + 1}
                      onItemsRendered={onItemsRendered}
                    >
                      {({ index, data, style }) => {
                        return (
                          <MessageContentRow
                            dayMessage={data[index]}
                            setRowHeight={setRowHeight}
                            index={index}
                            style={style}
                            hasMore={hasMore}
                          />
                        );
                      }}
                    </VariableSizeList>
                  );
                }}
              </InfiniteLoader>
            );
          }}
        </AutoSizer>
      </List>
    </Box>
  );
};

export default memo(MessageContentList);

import cacheUtils from "..";

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRmoveItem = jest.fn();

const mockLocalStorage = {
  key: () => "key",
  length: 0,
  clear: () => {},
  getItem: mockGetItem,
  setItem: mockSetItem,
  removeItem: mockRmoveItem,
};

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("Test cache channel", () => {
  test("Get updated time while no one existed", () => {
    const data = cacheUtils.getChannelUpdatedTime("id");
    expect(data).toEqual({ channel: 0, message: 0 });
  });

  test("Get updated time", () => {
    mockGetItem.mockImplementation(() => JSON.stringify({ id: { channel: 2, message: 0 } }));
    let data = cacheUtils.getChannelUpdatedTime("id");
    expect(data).toEqual({ channel: 2, message: 0 });

    mockGetItem.mockImplementation(() => JSON.stringify({ id: { channel: 0, message: 2 } }));
    data = cacheUtils.getChannelUpdatedTime("id");
    expect(data).toEqual({ channel: 0, message: 2 });
  });

  test("Set updated time", () => {
    mockGetItem.mockImplementation(() => JSON.stringify({ id: { channel: 2, message: 2 } }));
    cacheUtils.setChannelUpdatedTime("id", {});
    expect(mockSetItem).toBeCalledWith(
      "updatedTime",
      JSON.stringify({ id: { channel: 2, message: 2 } })
    );
  });

  test("Set compare updated time", () => {
    mockGetItem.mockImplementation(() => JSON.stringify({ id: { channel: 0, message: 2 } }));
    expect(cacheUtils.isSameUpdatedTime("id")).toBeFalsy();

    mockGetItem.mockImplementation(() => JSON.stringify({ id: { channel: 2, message: 2 } }));
    expect(cacheUtils.isSameUpdatedTime("id")).toBeTruthy();
  });
});

describe("Test cache message", () => {
  test("Get message while no one existed", () => {
    const data = cacheUtils.getCachedMessages("id");
    expect(data).toEqual({ channelId: "id", hasMore: false, messages: [] });
  });

  test("Get messages", () => {
    mockGetItem.mockImplementation(() =>
      JSON.stringify({ channelId: "id", messages: [{ id: "messageId" }] })
    );
    const data = cacheUtils.getCachedMessages("id");
    expect(data).toEqual({ channelId: "id", hasMore: false, messages: [{ id: "messageId" }] });
  });

  test("Set messages", () => {
    cacheUtils.setCachedMessages({ hasMore: true, channelId: "id", messages: [] });
    expect(mockSetItem).toBeCalledWith(
      "id",
      JSON.stringify({ hasMore: true, channelId: "id", messages: [] })
    );
  });

  test("Add message", () => {
    cacheUtils.addCachedMessage({
      channelId: "id",
      message: { id: "messageId" } as any,
    });
    expect(mockSetItem).toBeCalledWith(
      "id",
      JSON.stringify({ hasMore: false, channelId: "id", messages: [{ id: "messageId" }] })
    );
  });

  test("Update message", () => {
    mockGetItem.mockImplementation(() =>
      JSON.stringify({ channelId: "id", messages: [{ id: "messageId", url: "url" }] })
    );

    cacheUtils.updateCachedMessage({
      channelId: "id",
      message: { id: "messageId", url: "new_url" } as any,
    });
    expect(mockSetItem).toBeCalledWith(
      "id",
      JSON.stringify({
        hasMore: false,
        channelId: "id",
        messages: [{ id: "messageId", url: "new_url" }],
      })
    );
  });

  test("Remove messages", () => {
    cacheUtils.removeCachedMessages({ channelId: "id" });
    expect(mockRmoveItem).toBeCalledWith("id");
  });

  test("Remove message", () => {
    mockGetItem.mockImplementation(() =>
      JSON.stringify({ hasMore: false, channelId: "id", messages: [{ id: "messageId" }] })
    );
    cacheUtils.removeCachedMessage({ channelId: "id", messageId: "messageId" });
    expect(mockSetItem).toBeCalledWith(
      "id",
      JSON.stringify({ hasMore: false, channelId: "id", messages: [] })
    );
  });
});

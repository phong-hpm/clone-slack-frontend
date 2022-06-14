import { screen, within } from "@testing-library/react";
import mockIO from "socket.io-client";
import userEvent from "@testing-library/user-event";

// redux slices
import { setMessageSocket } from "store/slices/socket.slice";
import { setChannelUserList } from "store/slices/channelUsers.slice";

// components
import MediaFileList, {
  MediaFileListProps,
} from "pages/ChatPage/Conversation/ChatBox/MessageContent/MediaFileList";
import { SelectThumnailModalProps } from "components/MediaPlayer/SelectThumbnailModal";

// utils
import { SocketEvent } from "utils/constants";
import { customRender, store } from "__tests__/__setups__";

// types
import { MessageFileType, UserType } from "store/slices/_types";
import { AudioPlayerProps } from "components/MediaPlayer/AudioPlayer";
import { VideoPlayerProps } from "components/MediaPlayer/VideoPlayer";

jest.mock("components/MediaPlayer/AudioPlayer", () => (props: AudioPlayerProps) => (
  <div data-testid="AudioPlayer">
    <div data-testid="fire-onDelete" onClick={() => props.onDelete?.()} />
  </div>
));
jest.mock("components/MediaPlayer/VideoPlayer", () => (props: VideoPlayerProps) => (
  <div data-testid="VideoPlayer">
    <div data-testid="fire-onEditThumbnail" onClick={() => props.onEditThumbnail?.()} />
    <div data-testid="fire-onDelete" onClick={() => props.onDelete?.()} />
  </div>
));
jest.mock(
  "components/MediaPlayer/SelectThumbnailModal",
  () => (props: SelectThumnailModalProps) =>
    (
      <div data-testid="SelectThumbnailModal">
        <div
          data-testid="fire-onSelect"
          onClick={() => props.onSelect?.("http://example.com/thumb")}
        />
        <div data-testid="fire-onClose" onClick={() => props.onClose?.()} />
      </div>
    )
);

const messageSocket = mockIO();

const userData: UserType = {
  id: "U-o29OsxUsn",
  name: "Phong Ho",
  realname: "Phong Ho Pham Minh",
  email: "phonghophamminh@gmail.com",
  timeZone: "",
  avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
};
const audioFile: MessageFileType = {
  id: "audio-id",
  type: "audio",
  url: "http://example.com",
  duration: 75,
  mineType: "audio/webm",
  createdTime: new Date("11/11/2021").getTime(),
};

const videoFile: MessageFileType = {
  id: "video-id",
  type: "video",
  url: "http://example.com",
  duration: 75,
  mineType: "video/webm",
  createdTime: new Date("11/11/2021").getTime(),
  thumb: "http://example.com/thumb",
};

const renderComponent = (props?: Partial<MediaFileListProps>) => {
  return customRender(
    <MediaFileList
      messageId="messageId"
      messageUserId={userData.id}
      files={[videoFile, audioFile]}
      {...props}
    />
  );
};

beforeEach(() => {
  store.dispatch(setMessageSocket(messageSocket));
  store.dispatch(setChannelUserList([userData]));
});

describe("Test render", () => {
  test("When files is empty", () => {
    renderComponent({ files: [] });

    expect(screen.getByTestId("container").childNodes.length).toEqual(0);
  });

  test("With only 1 audio file", () => {
    renderComponent({ files: [audioFile] });

    expect(screen.getByText("audio")).toBeInTheDocument();
  });

  test("With only 1 video file", () => {
    renderComponent({ files: [videoFile] });

    expect(screen.getByText("video")).toBeInTheDocument();
  });

  test("With multiple files", () => {
    renderComponent();

    expect(screen.getByTestId("container").childNodes.length).toEqual(1);
    expect(screen.getByText("2 files")).toBeInTheDocument();
  });

  test("With file is uploading", () => {
    renderComponent({ files: [{ ...audioFile, status: "uploading" }] });

    // nothing to expect
  });
});

describe("Test actions", () => {
  test("Click to colapse", () => {
    renderComponent();

    userEvent.click(screen.getByText("2 files"));
  });

  describe("Delete audio", () => {
    test("Hover on Audio clip", () => {
      renderComponent();

      // Fire onDelete at AudioPlayer
      userEvent.click(within(screen.getByTestId("AudioPlayer")).getByTestId("fire-onDelete"));
      expect(screen.getByText("Delete clip")).toBeInTheDocument();
      expect(screen.getByText("Audio clip")).toBeInTheDocument();
      expect(screen.getByText(`${userData.name} Nov 11th at 12:00:00 AM`)).toBeInTheDocument();
      expect(screen.queryByText(/View.+/)).toBeNull();
      expect(screen.queryByText("Slack Clip")).toBeNull();
      expect(screen.queryByText(/.+in Slack/)).toBeNull();

      // Hover on video detail
      userEvent.hover(screen.getByText("Audio clip"));
      expect(screen.queryByText(`${userData.name} Nov 11th at 12:00:00 AM`)).toBeNull();
      expect(screen.getByText(/View.+/)).toBeInTheDocument();
      expect(screen.getByText("Slack Clip")).toBeInTheDocument();
      expect(screen.getByText(/.+in Slack/)).toBeInTheDocument();

      // unhover on video detail
      userEvent.unhover(screen.getByText("Audio clip"));
      expect(screen.queryByText(/View.+/)).toBeNull();
      expect(screen.queryByText("Slack Clip")).toBeNull();
      expect(screen.queryByText(/.+in Slack/)).toBeNull();
    });
    test("Click cancel", () => {
      renderComponent();

      // Fire onDelete at AudioPlayer
      userEvent.click(within(screen.getByTestId("AudioPlayer")).getByTestId("fire-onDelete"));

      // Click cancel
      userEvent.click(screen.getByText("Cancel"));
      expect(screen.queryByText("Delete clip")).toBeNull();
    });

    test("Click submit", () => {
      renderComponent();

      // Fire onDelete at AudioPlayer
      userEvent.click(within(screen.getByTestId("AudioPlayer")).getByTestId("fire-onDelete"));

      // Click submit
      userEvent.click(screen.getByText("Yes, Delete This Clip"));
      expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_REMOVE_MESSAGE_FILE, {
        data: { id: "messageId", fileId: audioFile.id },
      });
    });
  });

  describe("Delete video", () => {
    test("Hover on Video clip", () => {
      renderComponent();

      // Fire onDelete at VideoPlayer
      userEvent.click(within(screen.getByTestId("VideoPlayer")).getByTestId("fire-onDelete"));
      expect(screen.getByText("Delete clip")).toBeInTheDocument();
      expect(screen.getByText("Video clip")).toBeInTheDocument();
      expect(screen.getByText(`${userData.name} Nov 11th at 12:00:00 AM`)).toBeInTheDocument();
      expect(screen.queryByText(/View.+/)).toBeNull();
      expect(screen.queryByText("Slack Clip")).toBeNull();
      expect(screen.queryByText(/.+in Slack/)).toBeNull();

      // Hover on video detail
      userEvent.hover(screen.getByText("Video clip"));
      expect(screen.queryByText(`${userData.name} Nov 11th at 12:00:00 AM`)).toBeNull();
      expect(screen.getByText(/View.+/)).toBeInTheDocument();
      expect(screen.getByText("Slack Clip")).toBeInTheDocument();
      expect(screen.getByText(/.+in Slack/)).toBeInTheDocument();

      // unhover on video detail
      userEvent.unhover(screen.getByText("Video clip"));
      expect(screen.queryByText(/View.+/)).toBeNull();
      expect(screen.queryByText("Slack Clip")).toBeNull();
      expect(screen.queryByText(/.+in Slack/)).toBeNull();
    });

    test("Click cancel", () => {
      renderComponent();

      // Fire onDelete at VideoPlayer
      userEvent.click(within(screen.getByTestId("VideoPlayer")).getByTestId("fire-onDelete"));

      // Click cancel
      userEvent.click(screen.getByText("Cancel"));
      expect(screen.queryByText("Delete clip")).toBeNull();
    });

    test("Click submit", () => {
      renderComponent();

      // Fire onDelete at VideoPlayer
      userEvent.click(within(screen.getByTestId("VideoPlayer")).getByTestId("fire-onDelete"));

      // Click submit
      userEvent.click(screen.getByText("Yes, Delete This Clip"));
      expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_REMOVE_MESSAGE_FILE, {
        data: { id: "messageId", fileId: videoFile.id },
      });
    });
  });

  describe("Select thumbnail", () => {
    test("Click cancel", () => {
      renderComponent();

      // Fire onEditThumbnail at VideoPlayer
      userEvent.click(
        within(screen.getByTestId("VideoPlayer")).getByTestId("fire-onEditThumbnail")
      );

      // Fire onClose at SelectThumbnailModal
      userEvent.click(
        within(screen.getByTestId("SelectThumbnailModal")).getByTestId("fire-onClose")
      );

      expect(screen.queryByTestId("SelectThumbnailModal")).toBeNull();
    });

    test("Select a thumbnal", () => {
      renderComponent();

      // Fire onEditThumbnail at VideoPlayer
      userEvent.click(
        within(screen.getByTestId("VideoPlayer")).getByTestId("fire-onEditThumbnail")
      );

      // Fire onSelect at SelectThumbnailModal
      userEvent.click(
        within(screen.getByTestId("SelectThumbnailModal")).getByTestId("fire-onSelect")
      );

      expect(screen.queryByTestId("SelectThumbnailModal")).toBeNull();
    });
  });
});

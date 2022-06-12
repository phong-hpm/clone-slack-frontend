import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockIO from "socket.io-client";

// redux slices
import { setOpenCreateChannelModal } from "store/slices/globalModal.slice";
import { setChannelSocket } from "store/slices/socket.slice";

// components
import CreateChannelModal from "../CreateChannelModal";

// utils
import { customRender, store } from "tests";
import { SocketEvent } from "utils/constants";

const channelSocket = mockIO();

beforeEach(() => {
  store.dispatch(setChannelSocket(channelSocket));
  store.dispatch(setOpenCreateChannelModal(true));
});

describe("Test render", () => {
  test("Render CreateChannelModal", () => {
    customRender(<CreateChannelModal />);

    expect(screen.getByText("Create a channel")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Channels are where your team communicates. They're best when organized around a topic — #marketing, for example."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "When a channel is set to private, it can only be viewed or joined by invitation."
      )
    ).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click on the input to show dropdown", () => {
    customRender(<CreateChannelModal />);

    // Click switch button
    userEvent.click(screen.getByPlaceholderText("e.g. plan-budget"));
    expect(screen.getByText("help")).toBeInTheDocument();
    expect(screen.getByText("proj")).toBeInTheDocument();
    expect(screen.getByText("team")).toBeInTheDocument();
  });

  test("Blur input when value is empty", () => {
    customRender(<CreateChannelModal />);

    fireEvent.focus(screen.getByPlaceholderText("e.g. plan-budget"));
    fireEvent.blur(screen.getByPlaceholderText("e.g. plan-budget"));

    expect(screen.getByText("Don't forget to name your channel.")).toBeInTheDocument();
  });

  test("Blur input when value is over 80 characters", () => {
    customRender(<CreateChannelModal />);

    fireEvent.focus(screen.getByPlaceholderText("e.g. plan-budget"));
    // using fireEvent.change to reduce the number of rendering
    fireEvent.change(screen.getByPlaceholderText("e.g. plan-budget"), {
      target: { value: "0123456789".repeat(10) },
    });
    fireEvent.blur(screen.getByPlaceholderText("e.g. plan-budget"));

    expect(
      screen.getByText("Channel names can't be longer than 80 characters.")
    ).toBeInTheDocument();
    expect(screen.getByText("-20")).toBeInTheDocument();
  });

  test("Click switch button", () => {
    customRender(<CreateChannelModal />);

    // Click switch button
    userEvent.click(document.getElementsByTagName("input")[2]);
    expect(screen.getByText("Create a private channel")).toBeInTheDocument();
    expect(screen.getByText("This can't be undone.")).toBeInTheDocument();
    expect(
      screen.getByText("A private channel cannot be made public later on.")
    ).toBeInTheDocument();
  });

  test("Click submit", () => {
    customRender(<CreateChannelModal />);

    // Input channel name
    fireEvent.change(screen.getByPlaceholderText("e.g. plan-budget"), {
      target: { value: "Channel name" },
    });
    // Input channel description
    fireEvent.focus(screen.getByPlaceholderText("Description"));
    fireEvent.change(screen.getByPlaceholderText("Description"), {
      target: { value: "Channel description" },
    });
    fireEvent.blur(screen.getByPlaceholderText("Description"));

    // Click Create
    userEvent.click(screen.getByText("Create"));
    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_ADD_CHANNEL, {
      data: { name: "Channel name", desc: "Channel description" },
    });
    expect(store.getState().globalModal.isOpenCreateChannel).toBeFalsy();
  });
});

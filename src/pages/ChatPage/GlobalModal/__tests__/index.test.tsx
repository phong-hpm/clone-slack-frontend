import { screen } from "@testing-library/react";

// redux slices
import {
  setOpenAddUserChannelModal,
  setOpenArchiveChannelModal,
  setOpenChannelDetailModal,
  setOpenCreateChannelModal,
  setOpenEditChannelDescriptionModal,
  setOpenEditChannelNameModal,
  setOpenEditChannelTopicModal,
} from "store/slices/globalModal.slice";

// components
import GlobalModal from "..";

// utils
import { customRender, store } from "tests";

jest.mock("pages/ChatPage/GlobalModal/ChannelDetailModal", () => () => (
  <div>ChannelDetailModal</div>
));
jest.mock("pages/ChatPage/GlobalModal/AddUserChannelModal", () => () => (
  <div>AddUserChannelModal</div>
));
jest.mock("pages/ChatPage/GlobalModal/ArchiveChannelModal", () => () => (
  <div>ArchiveChannelModal</div>
));
jest.mock("pages/ChatPage/GlobalModal/CreateChannelModal", () => () => (
  <div>CreateChannelModal</div>
));
jest.mock("pages/ChatPage/GlobalModal/EditChannelDescriptionModal", () => () => (
  <div>EditChannelDescriptionModal</div>
));
jest.mock("pages/ChatPage/GlobalModal/EditChannelNameModal", () => () => (
  <div>EditChannelNameModal</div>
));
jest.mock("pages/ChatPage/GlobalModal/EditChannelTopicModal", () => () => (
  <div>EditChannelTopicModal</div>
));

beforeEach(() => {});

describe("Test render", () => {
  test("Render with empty redux state", () => {
    store.dispatch(setOpenChannelDetailModal(true));
    store.dispatch(setOpenAddUserChannelModal(true));
    store.dispatch(setOpenArchiveChannelModal(true));
    store.dispatch(setOpenCreateChannelModal(true));
    store.dispatch(setOpenEditChannelDescriptionModal(true));
    store.dispatch(setOpenEditChannelNameModal(true));
    store.dispatch(setOpenEditChannelTopicModal(true));

    customRender(<GlobalModal />);

    expect(screen.getByText("ChannelDetailModal")).toBeInTheDocument();
    expect(screen.getByText("AddUserChannelModal")).toBeInTheDocument();
    expect(screen.getByText("ArchiveChannelModal")).toBeInTheDocument();
    expect(screen.getByText("CreateChannelModal")).toBeInTheDocument();
    expect(screen.getByText("EditChannelDescriptionModal")).toBeInTheDocument();
    expect(screen.getByText("EditChannelNameModal")).toBeInTheDocument();
    expect(screen.getByText("EditChannelTopicModal")).toBeInTheDocument();
  });
});

// store
import { setupStore } from "store";

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

// redux selectors
import globalModalSelectors from "store/selectors/globalModal.selector";

// types

let store = setupStore();

beforeEach(() => {
  store = setupStore();
  store.dispatch(setOpenAddUserChannelModal(true));
  store.dispatch(setOpenCreateChannelModal(true));
  store.dispatch(setOpenChannelDetailModal(true));
  store.dispatch(setOpenEditChannelNameModal(true));
  store.dispatch(setOpenEditChannelTopicModal(true));
  store.dispatch(setOpenEditChannelDescriptionModal(true));
  store.dispatch(setOpenArchiveChannelModal(true));
});

test("Test globalModalSelectors", () => {
  expect(globalModalSelectors.getGlobalModalState(store.getState())).toEqual({
    isOpenAddUserChannel: true,
    isOpenArchiveChannelModal: true,
    isOpenChannelDetail: true,
    isOpenCreateChannel: true,
    isOpenEditChannelDescriptionModal: true,
    isOpenEditChannelNameModal: true,
    isOpenEditChannelTopicModal: true,
  });

  expect(globalModalSelectors.isOpenAddUserChannel(store.getState())).toBeTruthy();
  expect(globalModalSelectors.isOpenCreateChannel(store.getState())).toBeTruthy();
  expect(globalModalSelectors.isOpenChannelDetail(store.getState())).toBeTruthy();
  expect(globalModalSelectors.isOpenEditChannelNameModal(store.getState())).toBeTruthy();
  expect(globalModalSelectors.isOpenEditChannelTopicModal(store.getState())).toBeTruthy();
  expect(globalModalSelectors.isOpenEditChannelDescriptionModal(store.getState())).toBeTruthy();
  expect(globalModalSelectors.isOpenArchiveChannelModal(store.getState())).toBeTruthy();
});

import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

const getGlobalModalState = (state: RootState) => state.globalModal;

const isOpenAddUserChannel = createSelector(
  [getGlobalModalState],
  (globalModal) => globalModal.isOpenAddUserChannel
);
const isOpenCreateChannel = createSelector(
  [getGlobalModalState],
  (globalModal) => globalModal.isOpenCreateChannel
);
const isOpenChannelDetail = createSelector(
  [getGlobalModalState],
  (globalModal) => globalModal.isOpenChannelDetail
);
const isOpenEditChannelNameModal = createSelector(
  [getGlobalModalState],
  (globalModal) => globalModal.isOpenEditChannelNameModal
);
const isOpenEditChannelTopicModal = createSelector(
  [getGlobalModalState],
  (globalModal) => globalModal.isOpenEditChannelTopicModal
);
const isOpenEditChannelDescriptionModal = createSelector(
  [getGlobalModalState],
  (globalModal) => globalModal.isOpenEditChannelDescriptionModal
);
const isOpenArchiveChannelModal = createSelector(
  [getGlobalModalState],
  (globalModal) => globalModal.isOpenArchiveChannelModal
);

const globalModalSelectors = {
  getGlobalModalState,
  isOpenAddUserChannel,
  isOpenCreateChannel,
  isOpenChannelDetail,
  isOpenEditChannelNameModal,
  isOpenEditChannelTopicModal,
  isOpenEditChannelDescriptionModal,
  isOpenArchiveChannelModal,
};

export default globalModalSelectors;

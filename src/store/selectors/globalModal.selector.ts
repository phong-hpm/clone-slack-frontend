// types
import { RootState } from "store/_types";

const globalModalSelectors = {
  getGlobalModalState: (state: RootState) => state.globalModal,
  isOpenAddUserChannel: (state: RootState) => state.globalModal.isOpenAddUserChannel,
  isOpenCreateChannel: (state: RootState) => state.globalModal.isOpenCreateChannel,
  isOpenChannelDetail: (state: RootState) => state.globalModal.isOpenChannelDetail,
  isOpenEditChannelNameModal: (state: RootState) => state.globalModal.isOpenEditChannelNameModal,
  isOpenEditChannelTopicModal: (state: RootState) => state.globalModal.isOpenEditChannelTopicModal,
  isOpenEditChannelDescriptionModal: (state: RootState) =>
    state.globalModal.isOpenEditChannelDescriptionModal,
  isOpenArchiveChannelModal: (state: RootState) => state.globalModal.isOpenArchiveChannelModal,
};
export default globalModalSelectors;

// redux store
import { useSelector } from "store";

// redux selector
import globalModalSelectors from "store/selectors/globalModal.selector";

// components
import AddUserChannelModal from "./AddUserChannelModal";
import CreateChannelModal from "./CreateChannelModal";
import ChannelDetailModal from "./ChannelDetailModal";
import EditChanelNameModal from "./EditChanelNameModal";
import EditChanelTopicModal from "./EditChanelTopicModal";
import EditChanelDescriptionModal from "./EditChanelDescriptionModal";
import ArchiveChannelModal from "./ArchiveChannelModal";

/**
 * This component is existing for 2 purposes
 *   1. keep all GlobalModals inside it, will help to manage easily
 *   2. maybe some GlobalModals have [useEffect] with some logics, this components will
 *      prevent those [useEffect] fired its callback until Modal open
 */
const GlobalModals = () => {
  const globalModalState = useSelector(globalModalSelectors.getGlobalModalState);

  return (
    <>
      {globalModalState.isOpenAddUserChannel && <AddUserChannelModal />}
      {globalModalState.isOpenCreateChannel && <CreateChannelModal />}
      {globalModalState.isOpenChannelDetail && <ChannelDetailModal />}
      {globalModalState.isOpenEditChannelNameModal && <EditChanelNameModal />}
      {globalModalState.isOpenEditChannelTopicModal && <EditChanelTopicModal />}
      {globalModalState.isOpenEditChannelDescriptionModal && <EditChanelDescriptionModal />}
      {globalModalState.isOpenArchiveChannelModal && <ArchiveChannelModal />}
    </>
  );
};

export default GlobalModals;

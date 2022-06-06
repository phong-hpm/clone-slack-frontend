// redux store
import { useSelector } from "store";

// redux selector
import globalModalSelectors from "store/selectors/globalModal.selector";

// components
import AddUserChannelChannel from "./AddUserChannelModal";

/**
 * This component is existing for 2 purposes
 *   1. keep all GlobalModals inside it, will help to manage easily
 *   2. maybe some GlobalModals have [useEffect] with some logics, this components will
 *      prevent those [useEffect] fired its callback until Modal open
 */
const GlobalModals = () => {
  const isOpenAddUserChannel = useSelector(globalModalSelectors.isOpenAddUserChannel);

  return <>{isOpenAddUserChannel && <AddUserChannelChannel />}</>;
};

export default GlobalModals;

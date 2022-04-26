import { FC, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";

// redux store
import { useDispatch, useSelector } from "../../../store";

// redux selector
import * as chanelsSelectors from "../../../store/selectors/chanels.selector";

// components
import { setSelectedChanelId } from "../../../store/slices/chanels.slice";
import CreateChanelModal from "./CreateChanelModal";

export interface ChanelProps {
  onAddChanel: (chanelName: string, desc: string) => void;
}

const ChanelContent: FC<ChanelProps> = ({ onAddChanel }) => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const dispatch = useDispatch();

  const chanelList = useSelector(chanelsSelectors.getChanelList);
  const directMessagesList = useSelector(chanelsSelectors.getDirectMessagesList);
  const selectedChanelId = useSelector(chanelsSelectors.getSelectedChanelId);

  const [openModal, setOpenModal] = useState(false);

  const handleAddChanel = (channelName: string, desc: string) => {
    onAddChanel(channelName, desc);
    setOpenModal(false);
  };

  const handleSelectChanel = (id: string) => {
    dispatch(setSelectedChanelId(id));
    navigate(`/${teamId}/${id}`);
  };

  console.log("openModal", openModal);

  return (
    <div className="chanels">
      <div>
        <h3>Chanels</h3>
        <div className="chanel-list">
          {chanelList.map((chanel) => {
            const isActive = chanel.id === selectedChanelId;
            return (
              <div key={chanel.id} className={classNames("chanel-item", isActive && "active")}>
                <div onClick={() => !isActive && handleSelectChanel(chanel.id)}>
                  # {chanel.name}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={() => setOpenModal(true)}>+ Add chanel</button>
      </div>

      <div>
        <h3>Direct messages</h3>
        <div className="chanel-list">
          {directMessagesList.map((directMessage) => {
            const isActive = directMessage.id === selectedChanelId;
            return (
              <div
                key={directMessage.id}
                className={classNames("chanel-item", isActive && "active")}
              >
                <div onClick={() => !isActive && handleSelectChanel(directMessage.id)}>
                  # {directMessage.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <CreateChanelModal
        isOpen={openModal}
        onSubmit={handleAddChanel}
        onClose={() => setOpenModal(false)}
      />
    </div>
  );
};

export default ChanelContent;

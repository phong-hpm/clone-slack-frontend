import { FC, useRef } from "react";
import classNames from "classnames";

// redux store
import { useSelector } from "../../store";

// redux selector
import * as chanelsSelectors from "../../store/selectors/chanels.selector";

// components
import Messages from "./Messages";

export interface ChanelProps {
  onAddChanel: (chanelName: string) => void;
  onSelectChanel: (chanelId: string) => void;
}

const Chanel: FC<ChanelProps> = ({ onAddChanel, onSelectChanel }) => {
  const chanelList = useSelector(chanelsSelectors.getChanelList);
  const directMessagesList = useSelector(chanelsSelectors.getDirectMessagesList);
  const selectedChanelId = useSelector(chanelsSelectors.getSelectedChanelId);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddChanel = () => {
    if (!inputRef.current || !inputRef.current.value) return;
    onAddChanel(inputRef.current.value);
    inputRef.current.value = "";
  };

  return (
    <div className="chanels">
      <div
        style={{
          background: "#19171D",
          flex: "0 0 300px",
          alignItems: "stretch",
          color: "#a3a3a6",
        }}
      >
        <div>
          <h3>Chanels</h3>
          <div className="chanel-list">
            {chanelList.map((chanel) => {
              const isActive = chanel.id === selectedChanelId;
              return (
                <div key={chanel.id} className={classNames("chanel-item", isActive && "active")}>
                  <div onClick={() => !isActive && onSelectChanel(chanel.id)}># {chanel.name}</div>
                </div>
              );
            })}
          </div>
          <input ref={inputRef} name="chanel name" />
          <button onClick={handleAddChanel}>+</button>
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
                  <div onClick={() => !isActive && onSelectChanel(directMessage.id)}>
                    # {directMessage.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ flex: "1 0 auto", color: "#d1d2d3" }}>
        <Messages />
      </div>
    </div>
  );
};

export default Chanel;

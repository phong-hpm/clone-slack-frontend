import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "../../store";

import * as chanelsSelectors from "../../store/selectors/chanels.selector";
import * as usersSelectors from "../../store/selectors/users.selector";

import Messages from "./Messages";

const Chanel: FC = () => {
  const { teamId } = useParams();
  const navigate = useNavigate();

  const chanelList = useSelector(chanelsSelectors.getChanelList);
  const directMessagesList = useSelector(chanelsSelectors.getDirectMessagesList);
  const userList = useSelector(usersSelectors.getUserList);

  const handleChangeChanel = (id: string) => {
    navigate(`/${teamId}/${id}`);
  };

  const addChanel = () => {
    console.log("add");
  };

  return (
    <div style={{ display: "flex" }}>
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
          {chanelList.map((chanel) => {
            return (
              <div key={chanel.id}>
                <div onClick={() => handleChangeChanel(chanel.id)}># {chanel.name}</div>
              </div>
            );
          })}
          <input name="chanel name" />
          <button onClick={addChanel}>+</button>
        </div>

        <div>
          <h3>Direct messages</h3>
          {directMessagesList.map((directMessage) => {
            return (
              <div key={directMessage.id}>
                <div onClick={() => handleChangeChanel(directMessage.id)}>
                  # {directMessage.name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ flex: "1 0 auto", color: "#d1d2d3" }}>
        <Messages />
      </div>
    </div>
  );
};

export default Chanel;

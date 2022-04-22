import { FC } from "react";

import Teams from "./Teams";
import Chanels from "./Chanels";
import Messages from "./Messages";

const Main: FC = () => {
  return (
    <div>
      <div>
        <Teams />
      </div>
      <div>
        <Chanels />
      </div>
      <div>
        <Messages />
      </div>
    </div>
  );
};

export default Main;

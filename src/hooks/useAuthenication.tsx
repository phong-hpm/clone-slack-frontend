import { useEffect, useState } from "react";

import { useDispatch } from "../store";
import { verify } from "../store/actions/auth/verify";

const useAuthenication = () => {
  const dispatch = useDispatch();
  const [isRendered, setRendered] = useState(false);

  useEffect(() => {
    if (!isRendered) {
      setRendered(true);
    } else {
      dispatch(verify());
    }
  }, [isRendered, dispatch]);
};

export default useAuthenication;

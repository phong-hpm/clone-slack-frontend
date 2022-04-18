import { FC } from "react";
import { useNavigate } from "react-router-dom";

const Home: FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/login")}>Sign in</button>
    </div>
  );
};

export default Home;

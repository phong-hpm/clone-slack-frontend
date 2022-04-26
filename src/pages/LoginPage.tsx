import React, { FC, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// redux store
import { useDispatch, useSelector } from "../store";

// redux actions
import { login, LoginPostData } from "../store/actions/auth/login";

// redux selectors
import * as authSelectors from "../store/selectors/auth.selector";

// utils
import { RouterPath } from "../utils/constants";

const LoginPage: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const isAuth = useSelector(authSelectors.isAuth);
  const isLoading = useSelector(authSelectors.isLoading);

  const handleLogin = (event: React.MouseEvent) => {
    event.preventDefault();

    const postData: LoginPostData = {
      email: emailRef.current?.value || "",
      password: passwordRef.current?.value || "",
    };

    dispatch(login(postData));
  };

  useEffect(() => {
    if (isLoading) return;
    if (isAuth) navigate(RouterPath.TEAM_PAGE);
  }, [isLoading, isAuth, navigate]);

  return (
    <div>
      <form>
        <input
          ref={emailRef}
          disabled={isLoading}
          type="text"
          name="email"
          placeholder="Email address"
        />
        <input
          ref={passwordRef}
          disabled={isLoading}
          type="password"
          name="password"
          placeholder="Password"
        />
        <button disabled={isLoading} onClick={handleLogin} children="Login" />
      </form>
      {isLoading && <h1>Loading...</h1>}
    </div>
  );
};

export default LoginPage;

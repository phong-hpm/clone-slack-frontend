import { FC } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";

// redux store
import { store } from "./store";

// features
import Routes from "./features/Routes";

// mui
import theme from "./muiThemes";

const App: FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </Provider>
  );
};

export default App;

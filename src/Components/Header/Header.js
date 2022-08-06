import { AppBar, MenuItem, Select, Toolbar, Typography } from "@mui/material";
import { Container } from "@mui/system";
import styles from "./Header.module.css";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useContext } from "react";
import CryptoContext from "../../Store/crypto-context";
import AuthModal from "../Authentication/AuthModal";
import UserSideBar from "../Authentication/UserSidebar";

const Header = () => {
  const navigate = useNavigate();
  const cryptoCtx = useContext(CryptoContext);

  const navigateHandler = () => {
    navigate("/");
  };

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar color="transparent" position="static">
        <Container>
          <Toolbar>
            <Typography
              onClick={navigateHandler}
              className={styles.logo}
              variant="h6"
            >
              Crypto Tracker
            </Typography>
            <Select
              className={styles.select}
              value={cryptoCtx.currency}
              onChange={(event) => cryptoCtx.setCurrency(event.target.value)}
            >
              <MenuItem value={"INR"}>INR</MenuItem>
              <MenuItem value={"USD"}>USD</MenuItem>
            </Select>
            {cryptoCtx.user ? <UserSideBar /> : <AuthModal />}
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Header;

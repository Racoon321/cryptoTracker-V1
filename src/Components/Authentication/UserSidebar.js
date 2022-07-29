import React, { useContext } from "react";
import Drawer from "@mui/material/Drawer";
import CryptoContext from "../../Store/crypto-context";
import styles from "./UserSidebar.module.css";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { numberWithCommas } from "../Banner/Carousel";
import { AiFillDelete } from "react-icons/ai";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

const UserSidebar = () => {
  const [state, setState] = React.useState({
    right: false,
  });

  const cryptoCtx = useContext(CryptoContext);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const logoutHandler = () => {
    signOut(auth);

    cryptoCtx.setAlert({
      open: true,
      message: "You have successfully logged out.",
      type: "success",
    });

    toggleDrawer();
  };

  const removeFormWatchlistHandler = async (coin) => {
    const coinRef = doc(db, "watchlist", cryptoCtx.user.uid);
    try {
      await setDoc(
        coinRef,
        {
          coins: cryptoCtx.watchlist.filter((watch) => watch !== coin.id),
        },
        { merge: true }
      );

      cryptoCtx.setAlert({
        open: true,
        message: `${coin.name} Removed from Watchlist`,
        type: "success",
      });
    } catch (error) {
      cryptoCtx.setAlert({
        open: true,
        message: error.message,
        type: "error",
      });
    }
  };

  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Avatar
            onClick={toggleDrawer(anchor, true)}
            className={styles.avatar}
            src={cryptoCtx.user.photoURL}
            alt={cryptoCtx.user.displayName || cryptoCtx.user.email}
          />
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            <div className={styles.container}>
              <div className={styles.profile}>
                <Avatar
                  className={styles.picture}
                  src={cryptoCtx.user.photoURL}
                  alt={cryptoCtx.user.displayName || cryptoCtx.user.email}
                />
                <span className={styles.span}>
                  {cryptoCtx.user.displayName || cryptoCtx.user.email}
                </span>
                <div className={styles.watchlist}>
                  <span className={styles.watchlistText}>Watchlist</span>
                  {cryptoCtx.coins.map((coin) => {
                    if (cryptoCtx.watchlist.includes(coin.id)) {
                      return (
                        <div className={styles.coin}>
                          <span>{coin.name}</span>
                          <span className={styles.span1}>
                            {cryptoCtx.symbol}
                            {numberWithCommas(coin.current_price.toFixed(2))}
                            <AiFillDelete
                              style={{ cursor: "pointer" }}
                              fontSize="16"
                              onClick={() => removeFormWatchlistHandler(coin)}
                            />
                          </span>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
              <Button
                variant="contained"
                className={styles.logout}
                onClick={logoutHandler}
              >
                Logout
              </Button>
            </div>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default UserSidebar;

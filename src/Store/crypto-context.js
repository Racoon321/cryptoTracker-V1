import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { CoinList } from "../Config/api";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const CryptoContext = React.createContext({
  currency: null,
  symbol: null,
  setCurrency: () => {},
  coins: null,
  loading: null,
  fetchCoinsHandler: () => {},
  alert: null,
  setAlert: () => {},
  user: null,
  watchlist: null,
});

export const CryptoContextProvider = (props) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [user, setUser] = useState(null);
  const [watchlist, setWatchlist] = useState([]);

  const setCurrencyHandler = (newCurrency) => {
    setCurrency(newCurrency);
  };

  useEffect(() => {
    if (user) {
      const coinRef = doc(db, "watchlist", user.uid);

      var unsubscribe = onSnapshot(coinRef, (coin) => {
        if (coin.exists()) {
          setWatchlist(coin.data().coins);
        } else {
          console.log("No items in the watchlist!");
        }
      });
      return () => {
        unsubscribe();
      };
    }
  }, [user]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  useEffect(() => {
    if (currency === "INR") {
      setSymbol("₹");
    } else if (currency === "USD") {
      setSymbol("$");
    }
  }, [currency]);

  const fetchCoinsHandler = async () => {
    setLoading(true);

    const { data } = await axios.get(CoinList(currency));
    setCoins(data);

    setLoading(false);
  };

  const contextValue = {
    currency,
    symbol,
    setCurrency: setCurrencyHandler,
    coins,
    loading,
    fetchCoinsHandler,
    alert,
    setAlert,
    user,
    watchlist,
  };
  return (
    <CryptoContext.Provider value={contextValue}>
      {props.children}
    </CryptoContext.Provider>
  );
};

export default CryptoContext;

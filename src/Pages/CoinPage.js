import { useParams } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import CryptoContext from "../Store/crypto-context";
import { SingleCoin } from "../Config/api";
import axios from "axios";
import styles from "../Components/PageStyles/CoinPage.module.css";
import CoinInfo from "../Components/CoinInfo/CoinInfo";
import { Button, LinearProgress, Typography } from "@mui/material";
import parse from "html-react-parser";
import { numberWithCommas } from "../Components/Banner/Carousel";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CoinPage = () => {
  const parse = require("html-react-parser");
  const params = useParams();
  const cryptoCtx = useContext(CryptoContext);
  const [coin, setCoin] = useState();

  const fetchCoinData = async () => {
    const { data } = await axios.get(SingleCoin(params.coinId));
    setCoin(data);
  };

  useEffect(() => {
    fetchCoinData();
  }, [params.coinId]);
  console.log(coin);

  if (!coin) {
    return <LinearProgress className={styles.linearProgress}></LinearProgress>;
  }

  const inWatchList = cryptoCtx.watchlist.includes(coin?.id);

  const addToWatchlistHandler = async () => {
    const coinRef = doc(db, "watchlist", cryptoCtx.user.uid);
    try {
      await setDoc(coinRef, {
        coins: cryptoCtx.watchlist
          ? [...cryptoCtx.watchlist, coin.id]
          : coin.id,
      });

      cryptoCtx.setAlert({
        open: true,
        message: `${coin.name} Added to Watchlist`,
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

  const removeFromWatchlistHandler = async () => {
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
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <img
          src={coin?.image.large}
          alt={coin?.name}
          className={styles.sidebarImage}
        />
        <Typography variant="h6" className={styles.header}>
          {coin?.name}
        </Typography>
        <Typography variant="subtitl1" className={styles.description}>
          {parse(`${coin?.description.en.split(". ")[0]}`)}.
        </Typography>
        <div className={styles.marketData}>
          <span className={styles.marketDataSpan}>
            <Typography variant="h5" className={styles.header}>
              Rank:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" className={styles.coinRank}>
              {coin?.market_cap_rank}
            </Typography>
          </span>
          <span className={styles.marketDataSpan}>
            <Typography variant="h5" className={styles.header}>
              Current Price:
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" className={styles.coinRank}>
              {cryptoCtx.symbol}{" "}
              {numberWithCommas(
                coin?.market_data.current_price[
                  cryptoCtx.currency.toLowerCase()
                ]
              )}
            </Typography>
          </span>
          <span className={styles.marketDataSpan}>
            <Typography variant="h5" className={styles.header}>
              MarketCap:{""}
            </Typography>
            &nbsp; &nbsp;
            <Typography variant="h5" className={styles.coinRank}>
              {numberWithCommas(
                coin?.market_data.market_cap[cryptoCtx.currency.toLowerCase()]
                  .toString()
                  .slice(0, -6)
              )}
              M
            </Typography>
          </span>
          {cryptoCtx.user && (
            <Button
              variant="outlined"
              className={styles.button}
              onClick={
                inWatchList ? removeFromWatchlistHandler : addToWatchlistHandler
              }
            >
              {inWatchList ? "Remove from Watchlist" : "Add to Watchlist"}
            </Button>
          )}
        </div>
      </div>

      <CoinInfo coin={coin} />
    </div>
  );
};
export default CoinPage;

import axios from "axios";
import { TrendingCoins } from "../../Config/api";
import styles from "./Carousel.module.css";
import { useContext, useEffect, useState } from "react";
import CryptoContext from "../../Store/crypto-context";
import AliceCarousel from "react-alice-carousel";
import { Link } from "react-router-dom";
import { CircularProgress } from "@mui/material";

export const numberWithCommas = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Carousel = () => {
  const [trending, setTrending] = useState([]);
  const cryptoCtx = useContext(CryptoContext);
  const [loading, setLoading] = useState(false);

  const fetchTrendingCoinsHandler = async () => {
    setLoading(true);
    const { data } = await axios.get(TrendingCoins(cryptoCtx.currency));
    setTrending(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrendingCoinsHandler();
  }, [cryptoCtx.currency]);

  const responsive = {
    0: {
      items: 2,
    },
    512: {
      items: 4,
    },
  };

  const items = trending.map((coin) => {
    const profit = coin.price_change_percentage_24h >= 0;

    return (
      <Link to={`Coins/${coin.id}`} className={styles.carouselItem}>
        <img src={coin.image} alt={coin.name} className={styles.coinImage} />
        <span>
          {coin.symbol}
          &nbsp;
          <span
            style={{
              color: profit > 0 ? "rgba(14,203,129)" : "red",
              fontWeight: 500,
            }}
          >
            {profit && "+"}
            {coin.price_change_percentage_24h.toFixed(2)}%
          </span>
        </span>
        <span className={styles.symbol}>
          {cryptoCtx.symbol} {numberWithCommas(coin.current_price.toFixed(2))}
        </span>
      </Link>
    );
  });

  if (loading) {
    return <CircularProgress size={200} thickness={1} className={styles.circularProgress}/>;
  }

  return (
    <div className={styles.carousel}>
      <AliceCarousel
        mouseTracking
        infinite
        autoPlay
        autoPlayInterval={1000}
        animationDuration={1500}
        disableButtonsControls
        disableDotsControls
        responsive={responsive}
        items={items}
      />
    </div>
  );
};

export default Carousel;

import axios from "axios";
import { useState, useContext, useEffect } from "react";
import CryptoContext from "../../Store/crypto-context";
import { HistoricalChart } from "../../Config/api";
import { createTheme, ThemeProvider } from "@mui/system";
import styles from "./CoinInfo.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import SelectButton from "../UI/SelectButton";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
Chart.register(...registerables);

const CoinInfo = (props) => {
  const { currency } = useContext(CryptoContext);
  const [historicalData, setHistoricalData] = useState();
  const [days, setDays] = useState(1);

  const fetchHistoricalData = async () => {
    const { data } = await axios.get(
      HistoricalChart(props.coin.id, days, currency)
    );

    setHistoricalData(data.prices);
  };

  useEffect(() => {
    fetchHistoricalData();
  }, [currency, days]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  const chartDays = [
    {
      label: "24 hours",
      value: 1,
    },
    {
      label: "30 days",
      value: 30,
    },
    {
      label: "3 months",
      value: 90,
    },
    {
      label: "1 year",
      value: 365,
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={styles.container}>
        {!historicalData ? (
          <CircularProgress
            size={250}
            thickness={1}
            className={styles.circularProgress}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicalData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()}PM`
                      : `${date.getHours()}:${date.getMinutes()}AM`;

                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicalData.map((coin) => coin[1]),
                    label: `Price (Past ${days} Days) in ${currency}`,
                    borderColor: "#EEBC1D",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
              }}
            />
            <div className={styles.actions}>
              {chartDays.map((day) => (
                <SelectButton
                  onClick={() => setDays(day.value)}
                  key={day.value}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;

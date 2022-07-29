import { useEffect, useState, useContext } from "react";
import CryptoContext from "../../Store/crypto-context";
import { Container } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  LinearProgress,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import styles from "./CoinsTable.module.css";
import { useNavigate } from "react-router-dom";
import { numberWithCommas } from "../Banner/Carousel";

const CoinsTable = () => {
  const navigate = useNavigate();
  const cryptoCtx = useContext(CryptoContext);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    cryptoCtx.fetchCoinsHandler();
  }, [cryptoCtx.currency]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      mode: "dark",
    },
  });

  const searchChangeHandler = (event) => {
    setSearch(event.target.value);
  };
  const searchFilterHandler = () => {
    return cryptoCtx.coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(search) ||
        coin.symbol.toLowerCase().includes(search)
    );
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container className={styles.container}>
        <Typography variant="h4" className={styles.head}>
          Cryptocurrency Prices by Market Cap
        </Typography>
        <TextField
          label="Search for a Crypto Currency"
          variant="outlined"
          className={styles.textField}
          onChange={searchChangeHandler}
        />
        <TableContainer>
          {cryptoCtx.loading ? (
            <LinearProgress className={styles.linearProgress}></LinearProgress>
          ) : (
            <Table>
              <TableHead className={styles.tableHead}>
                <TableRow>
                  {["Coin", "Price", "24h Change", "MarketCap"].map((head) => {
                    return (
                      <TableCell
                        key={head}
                        align={head === "Coin" ? "left" : "right"}
                        className={styles.tHeadCell}
                      >
                        {head}
                      </TableCell>
                    );
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {searchFilterHandler()
                  .slice((page - 1) * 10, page * 10)
                  .map((coin) => {
                    const profit = coin.price_change_percentage_24h >= 0;

                    return (
                      <TableRow
                        className={styles.row}
                        key={coin.name}
                        onClick={() => {
                          navigate(`Coins/${coin.id}`);
                        }}
                      >
                        <TableCell scope="row" component="th">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className={styles.tBodyCellImage}
                          />
                          <div className={styles.tBodyCellDiv}>
                            <span className={styles.tBodyCellSymbol}>
                              {coin.symbol}
                            </span>
                            <span className={styles.tBodyCellName}>
                              {coin.name}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align="right">
                          {cryptoCtx.symbol}{" "}
                          {numberWithCommas(coin.current_price.toFixed(2))}
                        </TableCell>
                        <TableCell
                          align="right"
                          style={{
                            color: profit ? "rgb(14, 203, 129)" : "red",
                            fontWeight: 500,
                          }}
                        >
                          {profit && "+"}
                          {coin.price_change_percentage_24h.toFixed(2)}%
                        </TableCell>
                        <TableCell align="right">
                          {numberWithCommas(
                            coin.market_cap.toString().slice(0, -6)
                          )}
                          M
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <Pagination
          className={styles.pagination}
          count={parseInt((searchFilterHandler().length / 10).toFixed(0))}
          onChange={(_, value) => {
            setPage(value);
            window.scroll(0, 450);
          }}
        />
      </Container>
    </ThemeProvider>
  );
};

export default CoinsTable;

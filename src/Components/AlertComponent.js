import CryptoContext from "../Store/crypto-context";
import { useContext } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const AlertComponent = () => {
  const cryptoCtx = useContext(CryptoContext);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    cryptoCtx.setAlert({ open: false });
  };

  return (
    <Snackbar
      open={cryptoCtx.alert.open}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={handleClose}
        elevation={10}
        variant="filled"
        severity={cryptoCtx.alert.type}
      >
        {cryptoCtx.alert.message}
      </Alert>
    </Snackbar>
  );
};

export default AlertComponent;

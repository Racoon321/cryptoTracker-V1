import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useContext } from "react";
import styles from "./Signup.module.css";
import CryptoContext from "../../Store/crypto-context";
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const cryptoCtx = useContext(CryptoContext);

  const handleLogin = async () => {
    if (!email || !password) {
      cryptoCtx.setAlert({
        open: true,
        message: "Please fill all fields.",
        type: "error",
      });
      return;
    }

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      cryptoCtx.setAlert({
        open: true,
        message: `Login Successful. Welcome ${result.user.email}`,
        type: "success",
      });

      props.handleClose();
    } catch (error) {
      cryptoCtx.setAlert({ open: true, message: error.message, type: "error" });
    }
  };

  return (
    <Box p={3} className={styles.box}>
      <TextField
        variant="outlined"
        type="email"
        label="Enter Email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        fullWidth
      />
      <TextField
        variant="outlined"
        type="password"
        label="Enter Password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        size="large"
        className={styles.button}
        onClick={handleLogin}
      >
        Login
      </Button>
    </Box>
  );
};

export default Login;

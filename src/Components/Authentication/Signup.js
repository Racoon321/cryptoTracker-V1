import { Button, TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useState, useContext } from "react";
import styles from "./Signup.module.css";
import CryptoContext from "../../Store/crypto-context";
import { auth } from "../../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Signup = (props) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const cryptoCtx = useContext(CryptoContext);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      cryptoCtx.setAlert({
        open: true,
        message: "Passwords do not match!",
        type: "error",
      });
      return;
    }

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      cryptoCtx.setAlert({
        open: true,
        message: `Signup Successful. Welcome ${result.user.email}`,
        type: "success",
      });


      props.handleClose();
    } catch (error) {
      cryptoCtx.setAlert({ open: true, message: error.message, type: "error" });
      return;
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
      <TextField
        variant="outlined"
        type="password"
        label="Confirm Password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        size="large"
        className={styles.button}
        onClick={handleSignup}
      >
        Sign Up
      </Button>
    </Box>
  );
};

export default Signup;

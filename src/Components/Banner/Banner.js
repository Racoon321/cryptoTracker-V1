import { Container } from "@mui/system";
import styles from "./Banner.module.css";
import Typography from "@mui/material/Typography";
import Carousel from "./Carousel";

const Banner = () => {
  return (
    <div className={styles.banner}>
      <Container className={styles.bannerContent}>
        <div className={styles.tagline}>
          <Typography variant="h2" className={styles.name}>
            Crypto Tracker
          </Typography>
          <Typography className={styles.description}>
            Get all the info regarding your favourite cryptocurrency.
          </Typography>
        </div>
        <Carousel />
      </Container>
    </div>
  );
};

export default Banner;

import styles from "./SelectButton.module.css";

const SelectButton = (props) => {
  return (
    <span
      onClick={props.onClick}
      className={`${styles.selectButton} ${props.selected ? styles.selected : ""}`}
    >
      {props.children}
    </span>
  );
};

export default SelectButton;

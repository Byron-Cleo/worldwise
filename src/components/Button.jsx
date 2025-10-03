import styles from "./Button.module.css";

function Button({ children, onClick, type }) {
  return (
    <div onClick={onclick} className={`${styles.btn} ${styles[type]}`}>
      {children}
    </div>
  );
}

export default Button;

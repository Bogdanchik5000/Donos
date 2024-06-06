import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./BlueBtn.module.css";

interface IBlueBtn extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export default function BlueBtn({ children, className, ...props }: IBlueBtn) {
  return (
    <button {...props} className={`${styles["btn"]} ${className}`}>
      {children}
    </button>
  );
}

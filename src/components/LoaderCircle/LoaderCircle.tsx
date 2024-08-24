import { HTMLAttributes } from "react";
import styles from "./LoaderCircle.module.css";

interface LoaderCircleProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export default function LoaderCircle({
  className,
  ...props
}: LoaderCircleProps) {
  return <div {...props} className={`${styles["loader"]} ${className}`}></div>;
}

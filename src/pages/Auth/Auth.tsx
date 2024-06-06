import { FormEvent, useContext, useState } from "react";
import BlueBtn from "../../components/BlueBtn/BlueBtn";
import styles from "./Auth.module.css";
import { AuthContext } from "../../Providers/AuthContext";
import { IUserCredentials } from "../../interfaces/user-interfaces";
import { Navigate } from "react-router-dom";
import GoogleButton from "react-google-button";
import { loginGoogle } from "../../helpers/user-manage";

export default function Auth() {
  const [currentAuth, setCurrentAuth] = useState<"register" | "login">("login");
  const [userData, setUserData] = useState<IUserCredentials>({
    email: "",
    password: "",
  });
  const [isValidate, setIsValidate] = useState({
    email: false,
    password: false,
    isReady: false,
  });

  const { user, login, register } = useContext(AuthContext);
  if (user) return <Navigate to={"/"} />;

  function changeAuthMode() {
    setCurrentAuth(currentAuth === "register" ? "login" : "register");
    setIsValidate({ email: false, password: false, isReady: false });
    setUserData({ email: "", password: "" });
  }

  function handleSubmit(
    e: FormEvent<HTMLFormElement>,
    mode: "login" | "register"
  ) {
    e.preventDefault();
    setIsValidate({
      ...isValidate,
      isReady: true,
    });

    if (!isValidate.email || !isValidate.password) return;

    if (mode === "register") register(userData);
    if (mode === "login") login(userData);
  }

  if (currentAuth === "register") {
    return (
      <>
        <h3 className={styles["auth-mode"]}>Регистрация</h3>
        <form
          className={styles["auth-form"]}
          onSubmit={(e) => handleSubmit(e, "register")}
        >
          <input
            className={`${styles["input"]} ${
              !isValidate.email && isValidate.isReady && styles["error"]
            }`}
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) => {
              setUserData({ ...userData, email: e.target.value });
              setIsValidate({
                ...isValidate,
                email: validateEmail(e.target.value),
              });
            }}
          />
          <input
            className={`${styles["input"]} ${
              !isValidate.password && isValidate.isReady && styles["error"]
            }`}
            type="text"
            placeholder="Пароль"
            value={userData.password}
            onChange={(e) => {
              setUserData({ ...userData, password: e.target.value });
              setIsValidate({
                ...isValidate,
                password: validatePassword(e.target.value),
              });
            }}
          />
          <div className={styles["valid-errors"]}>
            {!isValidate.email && isValidate.isReady && (
              <span> Введите корректный email</span>
            )}
            {!isValidate.password && isValidate.isReady && (
              <span>
                Пароль должен содержать не менее 8 символов, одну заглавная и
                одну строчную букву
              </span>
            )}
          </div>
          <BlueBtn>Зарегистрироваться</BlueBtn>
        </form>
        <div className={styles["change-form"]}>
          Уже зарегистрированы?
          <span onClick={changeAuthMode}>Войти</span>
        </div>
        <div className={styles["another-auth"]}>
          <GoogleButton label="Войти через Google" onClick={loginGoogle} />
        </div>
      </>
    );
  }

  return (
    <>
      <h3 className={styles["auth-mode"]}>Вход</h3>
      <form
        className={styles["auth-form"]}
        onSubmit={(e) => handleSubmit(e, "login")}
      >
        <input
          className={`${styles["input"]} ${
            !isValidate.email && isValidate.isReady && styles["error"]
          }`}
          type="email"
          placeholder="Email"
          value={userData.email}
          onChange={(e) => {
            setUserData({ ...userData, email: e.target.value });
            setIsValidate({
              ...isValidate,
              email: validateEmail(e.target.value),
            });
          }}
        />
        <input
          className={`${styles["input"]} ${
            !isValidate.password && isValidate.isReady && styles["error"]
          }`}
          type="text"
          placeholder="Пароль"
          value={userData.password}
          onChange={(e) => {
            setUserData({ ...userData, password: e.target.value });
            setIsValidate({
              ...isValidate,
              password: validatePassword(e.target.value),
            });
          }}
        />
        <div className={styles["valid-errors"]}>
          {!isValidate.email && isValidate.isReady && (
            <span> Введите корректный email</span>
          )}
          {!isValidate.password && isValidate.isReady && (
            <span>
              Пароль должен содержать не менее 8 символов, одну заглавная и одну
              строчную букву
            </span>
          )}
        </div>
        <BlueBtn>Войти</BlueBtn>
      </form>
      <div className={styles["change-form"]}>
        Нет аккаунта?
        <span onClick={changeAuthMode}>Зарегистрироваться</span>
      </div>
      <div className={styles["another-auth"]}>
        <GoogleButton label="Войти через Google" onClick={loginGoogle} />
      </div>
    </>
  );
}

function validatePassword(password: string) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  return passwordRegex.test(password.trim());
}

function validateEmail(email: string) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

import { Link, Outlet } from "react-router-dom";
import BlueBtn from "../components/BlueBtn/BlueBtn";
import authApi from "../api/authApi";
import { useAppDispatch, useAppSelector } from "../hooks/hooks.redux.";
import LoaderCircle from "../components/LoaderCircle/LoaderCircle";
import { useEffect } from "react";
import { getAllReports } from "../store/slices/reportsSlice";

import styles from "./Layout.module.css";

export default function Layout() {
  const auth = useAppSelector((state) => state.authSlice);
  const reports = useAppSelector((state) => state.reportsSlice);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllReports());
  }, [dispatch]);

  return (
    <>
      <header className={styles["header"]}>
        <div className={`container ${styles["header-wrap"]}`}>
          <Link to={"/"} className={styles["header-logo"]}>
            <img src="/russia.svg" alt="флаг россии" height={30} />
            <h1>DONOS.RU</h1>
          </Link>
          <div className={styles["header-right"]}>
            <span>ДОНОСИМ ИНФОРМАЦИЮ С 2016 ГОДА</span>
            <div className={styles["header-auth"]}>
              {!auth.isAuth ? (
                <Link to={"/auth"}>
                  <BlueBtn>Войти</BlueBtn>
                </Link>
              ) : (
                <>
                  <BlueBtn onClick={authApi.logout}>Выйти</BlueBtn>
                  <Link to={"/profile"} className={styles["profile"]}>
                    <img src="/profile.svg" alt="картинка профиля" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className={styles["report"]}>
        <div className={`container ${styles["report-wrap"]}`}>
          <div className={styles["report-counter"]}>
            Доносов в базе:{" "}
            {!reports.isLoading ? (
              reports.allReports.length
            ) : (
              <LoaderCircle className={styles["report-counter-loader"]} />
            )}
          </div>
          <div className={styles["report-panel"]}>
            <span>
              Твой донос может изменить все, не упускай эту возможность
            </span>
            <Link to={"/report"}>
              <BlueBtn>Сообщить куда следует</BlueBtn>
            </Link>
          </div>
        </div>
      </section>

      <Outlet />

      <footer className={styles["footer"]}>
        <h1>DONOS.RU</h1>
      </footer>
    </>
  );
}

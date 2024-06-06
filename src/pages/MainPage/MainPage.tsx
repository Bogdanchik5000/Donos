import { Link, Outlet, useLocation } from "react-router-dom";
import styles from "./MainPage.module.css";
import BlueBtn from "../../components/BlueBtn/BlueBtn";
import { useContext } from "react";
import { AuthContext } from "../../Providers/AuthContext";
import { logout } from "../../helpers/user-manage";
import LoaderCircle from "../../components/LoaderCircle/LoaderCircle";
import { ReportsDataContext } from "../../Providers/ReportsDataProvider";
import LatestReports from "../../components/LatestReports/Latest";

export default function MainPage() {
  const { pathname } = useLocation();

  const { user } = useContext(AuthContext);
  const { allReports, isLoading } = useContext(ReportsDataContext);

  const reportsDemo = allReports
    .slice(0, 5)
    .filter((report) => report.allowPublish);

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
              {!user ? (
                <Link to={"/auth"}>
                  <BlueBtn>Войти</BlueBtn>
                </Link>
              ) : (
                <>
                  <BlueBtn onClick={() => logout()}>Выйти</BlueBtn>
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
            {!isLoading ? (
              allReports.length
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
      <section className={styles["main-section"]}>
        <div className="container">
          {pathname === "/" ? (
            <>
              {!isLoading ? (
                <LatestReports reports={reportsDemo} isLoading={isLoading} />
              ) : (
                <LoaderCircle />
              )}
            </>
          ) : (
            <Outlet />
          )}
        </div>
      </section>
      <footer className={styles["footer"]}>
        <h1>DONOS.RU</h1>
      </footer>
    </>
  );
}

import { useContext, useEffect, useState } from "react";
import styles from "./Proflile.module.css";
import { AuthContext } from "../../Providers/AuthContext";
import BlueBtn from "../../components/BlueBtn/BlueBtn";
import useUserData from "../../hooks/useUserData";
import LoaderCircle from "../../components/LoaderCircle/LoaderCircle";
import ReportsList from "../../components/ReportsList/ReportsList";
import { setUserName } from "../../helpers/user-manage";
import { useNavigate } from "react-router-dom";
export default function Profile() {
  const { user } = useContext(AuthContext);
  const { userData, isLoading, fetchData } = useUserData();

  const [isOpen, setIsOpen] = useState(false);
  const [isSetName, setIsSetName] = useState(false);
  const [newName, setNewName] = useState(user!.email!);

  const navigate = useNavigate();

  useEffect(() => {
    if (userData.fullName) {
      setNewName(userData.fullName);
    }
  }, [userData.fullName]);

  async function changeName() {
    await setUserName(newName);
    await fetchData();
    setIsSetName(false);
  }

  if (isLoading) {
    return <LoaderCircle />;
  }

  return (
    <div className={styles["profile-wrap"]}>
      <>
        <div className={styles["user-data"]}>
          {!isSetName ? (
            <span className={styles["user-name"]}>{newName}</span>
          ) : (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{ maxWidth: 215 }}
            />
          )}
          {!isSetName && (
            <div
              className={styles["set-name"]}
              onClick={() => setIsSetName(true)}
            >
              Сменить имя ?
            </div>
          )}
          {isSetName && (
            <div className={styles["set-name-marks"]}>
              <img
                src="/check.svg"
                alt="сохранить"
                height={30}
                onClick={changeName}
              />
              <img
                src="/xmark.svg"
                alt="отмена"
                height={30}
                onClick={() => setIsSetName(false)}
              />
            </div>
          )}
        </div>

        <span>Доносов написано : {userData.reports.length}</span>
        <span>Рейтинг : {userData.rating}</span>
        {!isOpen ? (
          <BlueBtn
            onClick={() => setIsOpen(true)}
            className={styles["btn"]}
            disabled={userData.reports.length === 0}
          >
            Мои доносы
          </BlueBtn>
        ) : (
          <>
            <ReportsList reports={userData.reports} edit={true} />
            <BlueBtn
              onClick={() => setIsOpen(false)}
              className={`${styles["btn"]} ${styles["btn-close"]}`}
            >
              Закрыть
            </BlueBtn>
          </>
        )}
        <BlueBtn className={styles["btn"]} onClick={() => navigate("/")}>
          На главную
        </BlueBtn>
      </>
    </div>
  );
}

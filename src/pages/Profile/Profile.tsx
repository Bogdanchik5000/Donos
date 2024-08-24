import { useEffect, useState } from "react";
import styles from "./Proflile.module.css";
import BlueBtn from "../../components/BlueBtn/BlueBtn";
import LoaderCircle from "../../components/LoaderCircle/LoaderCircle";
import ReportsList from "../../components/ReportsList/ReportsList";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks.redux.";
import userApi from "../../api/userApi";
import { getUserData } from "../../store/slices/userSlice";
export default function Profile() {
  const user = useAppSelector((state) => state.authSlice.user);
  const userData = useAppSelector((state) => state.userSlice);
  const reportsLoading = useAppSelector(
    (state) => state.reportsSlice.isLoading
  );
  const dispatch = useAppDispatch();

  const [isOpen, setIsOpen] = useState(false);
  const [isSetName, setIsSetName] = useState(false);
  const [newName, setNewName] = useState(user!.email!);

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUserData(user!));
  }, [dispatch, user]);

  useEffect(() => {
    if (userData.fullName) {
      setNewName(userData.fullName);
    }
  }, [userData.fullName]);

  async function changeName() {
    await userApi.updateUserName(user!, newName);
    setIsSetName(false);
  }

  if (userData.isLoading || reportsLoading) {
    return (
      <div className="container">
        <LoaderCircle />
      </div>
    );
  }

  return (
    <div className="container">
      <div className={styles["profile-wrap"]}>
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
            <ReportsList
              reports={userData.reports}
              edit={true}
              closeReports={setIsOpen}
            />
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
      </div>
    </div>
  );
}

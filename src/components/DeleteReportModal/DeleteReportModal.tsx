import styles from "./DeleteReportModal.module.css";
import LoaderCircle from "../LoaderCircle/LoaderCircle";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks.redux.";
import { deleteReportById } from "../../store/slices/reportsSlice";
import {
  updateUserRating,
  updateUserReports,
} from "../../store/slices/userSlice";

interface IDeleteReportModal {
  closeModal: (value: boolean) => void;
  closeReports?: (value: boolean) => void;
  id: string;
}

export default function DeleteReportModal({
  closeModal,
  closeReports,
  id,
}: IDeleteReportModal) {
  const auth = useAppSelector((state) => state.authSlice);
  const reports = useAppSelector((state) => state.reportsSlice);

  const dispatch = useAppDispatch();

  async function deleteReport() {
    dispatch(deleteReportById({ user: auth.user!, id }));
    dispatch(updateUserRating({ user: auth.user!, rating: -10 }));
    dispatch(updateUserReports(auth.user!));

    closeModal(false);
    closeReports?.(false);
  }

  return (
    <div className={styles["modal-wrap"]} onClick={() => closeModal(false)}>
      <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
        <div className={styles["modal-confirm"]}>
          <span>Вы собираетесь удалить донос</span>
          <span>За удаление снимается 10 очков рейтинга</span>
          {!reports.isLoading ? (
            <button className={styles["delete-btn"]} onClick={deleteReport}>
              Удалить донос
            </button>
          ) : (
            <LoaderCircle />
          )}
        </div>
        <div
          className={styles["modal-close"]}
          onClick={() => closeModal(false)}
        >
          &#215;
        </div>
      </div>
    </div>
  );
}

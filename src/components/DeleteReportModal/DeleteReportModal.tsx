import { useNavigate } from "react-router-dom";
import { deleteReportById } from "../../helpers/report-manage";
import styles from "./DeleteReportModal.module.css";
import { useState } from "react";
import LoaderCircle from "../LoaderCircle/LoaderCircle";

interface IDeleteReportModal {
  action: (value: boolean) => void;
  id: string;
}

export default function DeleteReportModal({ action, id }: IDeleteReportModal) {
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const navigate = useNavigate();

  async function deleteReport() {
    setIsDeleteLoading(true);
    await deleteReportById(id);

    navigate("/profile");
    location.reload();
  }

  return (
    <div className={styles["modal-wrap"]} onClick={() => action(false)}>
      <div className={styles["modal"]} onClick={(e) => e.stopPropagation()}>
        <div className={styles["modal-confirm"]}>
          <span>Вы собираетесь удалить донос</span>
          <span>За удаление снимается 10 очков рейтинга</span>
          {!isDeleteLoading ? (
            <button className={styles["delete-btn"]} onClick={deleteReport}>
              Удалить донос
            </button>
          ) : (
            <LoaderCircle />
          )}
        </div>
        <div className={styles["modal-close"]} onClick={() => action(false)}>
          &#215;
        </div>
      </div>
    </div>
  );
}

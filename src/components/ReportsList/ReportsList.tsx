import styles from "./ReportsList.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Link } from "react-router-dom";
import DeleteReportModal from "../DeleteReportModal/DeleteReportModal";
import { useEffect, useState } from "react";
import { IReportData } from "../../interfaces/report-interfaces";

export default function ReportsList({
  reports,
  edit,
  closeReports,
}: {
  reports: IReportData[];
  edit?: boolean;
  closeReports?: (value: boolean) => void;
}) {
  const [isDelete, setIsDelete] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  useEffect(() => {
    if (isDelete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "visible";
    }

    return () => {
      document.body.style.overflow = "visible";
    };
  }, [isDelete]);

  return (
    <>
      <ul className={styles["reports-list"]}>
        <Swiper
          grabCursor={true}
          slidesPerView={1}
          pagination={{
            dynamicBullets: true,
          }}
          navigation={true}
          modules={[Pagination, Navigation]}
          spaceBetween={50}
        >
          {reports.map((el) => (
            <SwiperSlide className={styles["report-slide"]} key={el.id}>
              <li className={styles["reports-item"]}>
                <div className={styles["report-date"]}>{el.formattedDate}</div>
                <div className={styles["report-author"]}>
                  {el.fullName || "Анонимно"}
                </div>
                <div className={styles["report-department"]}>
                  {el.department}
                </div>
                <p className={styles["report-message"]}>{el.reportMessage}</p>
                {edit && (
                  <div className={styles["report-actions"]}>
                    <Link to={`/edit/${el.id}`}>
                      <img
                        src="/edit.svg"
                        alt="редактировать"
                        className={styles["actions-icon"]}
                      />
                    </Link>
                    <img
                      src="/trash.svg"
                      alt="удалить"
                      className={styles["actions-icon"]}
                      onClick={() => {
                        setIsDelete(true);
                        setDeleteId(el.id);
                      }}
                    />
                  </div>
                )}
              </li>
            </SwiperSlide>
          ))}
        </Swiper>
      </ul>
      {isDelete && (
        <DeleteReportModal
          closeModal={setIsDelete}
          closeReports={closeReports}
          id={deleteId}
        />
      )}
    </>
  );
}

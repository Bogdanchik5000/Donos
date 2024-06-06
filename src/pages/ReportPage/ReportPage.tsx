import { useContext, useEffect, useState } from "react";
import styles from "./ReportPage.module.css";
import BlueBtn from "../../components/BlueBtn/BlueBtn";
import { addReport } from "../../helpers/report-manage";
import { IReportDataForPublish } from "../../interfaces/report-interfaces";
import { updateUserRating } from "../../helpers/user-manage";
import { ReportsDataContext } from "../../Providers/ReportsDataProvider";
import calcRating from "../../helpers/calc-rating";
import { useNavigate } from "react-router-dom";
import LoaderCircle from "../../components/LoaderCircle/LoaderCircle";

export default function ReportPage() {
  const [reportData, setReportData] = useState<IReportDataForPublish>({
    reportMessage: "",
    department: "Следственный Комитет Российской Федерации",
    isAnonim: false,
    allowPublish: false,
    fullName: "",
  });

  const [isValid, setIsValid] = useState({
    message: true,
    fullName: true,
  });

  const [isLoading, setIsLoading] = useState(false);

  const { fetchReports } = useContext(ReportsDataContext);

  const navigate = useNavigate();

  useEffect(() => {
    if (reportData.isAnonim) {
      setIsValid({ message: true, fullName: true });
      setReportData({ ...reportData, fullName: "" });
    }
  }, [reportData]);

  async function handleSubmit() {
    setIsLoading(true);

    await addReport(
      reportData.reportMessage,
      reportData.department,
      reportData.allowPublish,
      reportData.isAnonim,
      reportData.fullName
    );
    await updateUserRating(calcRating(reportData.reportMessage));
    await fetchReports();

    setIsLoading(false);

    navigate("/profile");

    setIsValid({ message: true, fullName: true });
  }

  return (
    <>
      <h2 className={styles["title"]}>Доложить куда следует</h2>
      <div className={styles["department"]}>
        <span>ВЕДОМСТВО</span>
        <select
          onChange={(e) =>
            setReportData({ ...reportData, department: e.target.value })
          }
          style={{ width: "100%" }}
        >
          <option>Следственный Комитет Российской Федерации</option>
          <option>Генеральная прокуратура РФ</option>
          <option>МВД РФ</option>
          <option>ФСБ РФ</option>
          <option>ФСКН РФ</option>
          <option>ФТС России</option>
          <option>Государственная дума РФ</option>
          <option>Администрация Президента РФ</option>
        </select>
      </div>
      <div className={styles["report"]}>
        <span>ДОВОЖУ ДО ВАШЕГО СВЕДЕНИЯ, ЧТО</span>
        {!isValid.message && (
          <span style={{ color: "red" }}>
            Введите сообщение длиной не менее 10 символов
          </span>
        )}
        <textarea
          className={`${styles["report-message"]} ${
            !isValid.message ? styles["invalid"] : ""
          }`}
          onChange={(e) => {
            setReportData({ ...reportData, reportMessage: e.target.value });
          }}
        ></textarea>
        <div className={styles["personal-data"]}>
          <div className={styles["inputs"]}>
            {!isValid.fullName && (
              <span style={{ color: "red" }}>
                Введите ФИО в формате: Иванов Иван Иванович
              </span>
            )}
            <input
              type="text"
              placeholder="ФИО"
              disabled={reportData.isAnonim}
              className={`${!isValid.fullName ? styles["invalid"] : ""}`}
              onChange={(e) => {
                setReportData({ ...reportData, fullName: e.target.value });
              }}
              value={reportData.fullName}
            />
          </div>
          <div className={styles["checkboxes"]}>
            <label className={styles["anonim"]}>
              <input
                type="checkbox"
                onChange={() => {
                  setReportData({
                    ...reportData,
                    isAnonim: !reportData.isAnonim,
                  });
                }}
              />
              <span>Анонимно</span>
            </label>
            <label className={styles["publication"]}>
              <input
                type="checkbox"
                onChange={() =>
                  setReportData({
                    ...reportData,
                    allowPublish: !reportData.allowPublish,
                  })
                }
              />
              <span>Разрешаю публиковать текст доноса на сайте</span>
            </label>
          </div>
        </div>
      </div>
      {!isLoading ? (
        <div className={styles["action-btns"]}>
          <BlueBtn onClick={handleSubmit}>Донести</BlueBtn>
          <BlueBtn onClick={() => navigate(-1)}>Закрыть</BlueBtn>
          <BlueBtn onClick={() => navigate("/")}>На главную</BlueBtn>
        </div>
      ) : (
        <LoaderCircle />
      )}
    </>
  );
}

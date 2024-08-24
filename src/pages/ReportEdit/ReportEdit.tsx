import { useEffect, useState } from "react";
import styles from "../ReportPage/ReportPage.module.css";
import BlueBtn from "../../components/BlueBtn/BlueBtn";
import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { IReportDataForPublish } from "../../interfaces/report-interfaces";
import LoaderCircle from "../../components/LoaderCircle/LoaderCircle";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks.redux.";
import { updateReport } from "../../store/slices/reportsSlice";

export default function ReportEdit() {
  const reportDataFromDb = useLoaderData() as IReportDataForPublish;
  const { reportId } = useParams();

  const navigate = useNavigate();

  const [reportData, setReportData] =
    useState<IReportDataForPublish>(reportDataFromDb);

  const [isValid, setIsValid] = useState({
    message: true,
    fullName: true,
  });

  const isLoading = useAppSelector((state) => state.reportsSlice.isLoading);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (reportData.isAnonim) {
      setIsValid({ message: true, fullName: true });
    }
  }, [reportData.isAnonim]);

  const validateMessage = (message: string) => {
    return message.length >= 10;
  };

  const validateFullName = (fullName: string) => {
    const nameRegex = /^[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+\s[А-ЯЁ][а-яё]+$/;
    return nameRegex.test(fullName);
  };

  async function handleSubmit() {
    const isMessageValid = validateMessage(reportData.reportMessage);
    const isFullNameValid =
      reportData.isAnonim || validateFullName(reportData.fullName);

    if (!isMessageValid || !isFullNameValid) {
      setIsValid({
        message: isMessageValid,
        fullName: isFullNameValid,
      });
      return;
    }

    dispatch(updateReport({ newData: reportData, id: reportId! }));

    setIsValid({ message: true, fullName: true });
    navigate("/profile");
  }

  return (
    <div className="container">
      <h2 className={styles["title"]}>Доложить куда следует</h2>
      <div className={styles["department"]}>
        <span>ВЕДОМСТВО</span>
        <select
          onChange={(e) =>
            setReportData({ ...reportData, department: e.target.value })
          }
          value={reportData.department}
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
            const value = e.target.value;
            setIsValid((prevState) => ({
              ...prevState,
              message: validateMessage(value),
            }));
            setReportData({ ...reportData, reportMessage: value });
          }}
          value={reportData.reportMessage}
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
                const value = e.target.value;
                setIsValid((prevState) => ({
                  ...prevState,
                  fullName: validateFullName(value),
                }));
                setReportData({ ...reportData, fullName: value });
              }}
              value={reportData.fullName}
            />
          </div>
        </div>
      </div>
      {!isLoading ? (
        <>
          <BlueBtn
            onClick={handleSubmit}
            style={{ marginTop: 20, marginRight: 20 }}
          >
            Изменить
          </BlueBtn>
          <BlueBtn onClick={() => navigate("/profile")}>Закрыть</BlueBtn>
        </>
      ) : (
        <LoaderCircle style={{ marginTop: 20 }} />
      )}
    </div>
  );
}

import { useState } from "react";
import BlueBtn from "../BlueBtn/BlueBtn";
import ReportsList from "../ReportsList/ReportsList";
import LoaderCircle from "../LoaderCircle/LoaderCircle";

import styles from "./Latest.module.css";
import { IReportData } from "../../interfaces/report-interfaces";

interface ILatestReport {
  isLoading: boolean;
  reports: IReportData[];
}

export default function LatestReports({ reports, isLoading }: ILatestReport) {
  const [isOpen, setIsOpen] = useState(false);

  if (!reports.length) {
    return <div>Здесь будут доносы</div>;
  }

  if (!isOpen) {
    return (
      <BlueBtn onClick={() => setIsOpen(true)}>
        Смотреть последние публичные доносы
      </BlueBtn>
    );
  }

  return (
    <>
      {!isLoading ? <ReportsList reports={reports} /> : <LoaderCircle />}
      <BlueBtn onClick={() => setIsOpen(false)} className={styles["close-btn"]}>
        Закрыть
      </BlueBtn>
    </>
  );
}

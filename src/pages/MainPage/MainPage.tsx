import { useEffect } from "react";
import LatestReports from "../../components/LatestReports/Latest";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks.redux.";
import styles from "./MainPage.module.css";
import { getAllReports } from "../../store/slices/reportsSlice";
import LoaderCircle from "../../components/LoaderCircle/LoaderCircle";

export default function MainPage() {
  const reports = useAppSelector((state) => state.reportsSlice);
  const dispatch = useAppDispatch();

  const reportsDemo = reports.allReports
    .slice(0, 5)
    .filter((report) => report.allowPublish);

  useEffect(() => {
    dispatch(getAllReports());
  }, [dispatch]);

  return (
    <div className="container">
      <div className={styles["latest-reports"]}>
        <div className="container">
          {!reports.isLoading ? (
            <LatestReports
              reports={reportsDemo}
              isLoading={reports.isLoading}
            />
          ) : (
            <LoaderCircle />
          )}
        </div>
      </div>
    </div>
  );
}

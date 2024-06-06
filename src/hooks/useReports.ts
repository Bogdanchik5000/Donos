import { useEffect, useState } from "react";
import { getAllReports } from "../helpers/report-manage";
import { IReportData } from "../interfaces/report-interfaces";

export default function useReports(): [
  IReportData[],
  () => Promise<void>,
  boolean
] {
  const [reports, setReports] = useState<IReportData[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchReports() {
    setIsLoading(true);
    const allReports = await getAllReports();

    setReports(allReports);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchReports();
  }, []);

  return [reports, fetchReports, isLoading];
}

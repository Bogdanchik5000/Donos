import { ReactNode, createContext } from "react";
import useReports from "../hooks/useReports";
import { IReportData } from "../interfaces/report-interfaces";

interface IReportsDataContext {
  allReports: IReportData[];
  isLoading: boolean;
  fetchReports: () => Promise<void>;
}

export const ReportsDataContext = createContext<IReportsDataContext>(
  {} as IReportsDataContext
);

export default function ReportsDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [allReports, fetchReports, isLoading] = useReports();

  return (
    <ReportsDataContext.Provider
      value={{ allReports, isLoading, fetchReports }}
    >
      {children}
    </ReportsDataContext.Provider>
  );
}

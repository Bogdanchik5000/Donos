import { Timestamp } from "firebase/firestore";

export interface IReportData {
  reportMessage: string;
  department: string;
  id: string;
  isAnonim: boolean;
  allowPublish: boolean;
  fullName: string;
  createdAt: Timestamp;
  formattedDate: string;
}

export interface IReportDataForPublish {
  reportMessage: string;
  department: string;
  isAnonim: boolean;
  allowPublish: boolean;
  fullName: string;
}

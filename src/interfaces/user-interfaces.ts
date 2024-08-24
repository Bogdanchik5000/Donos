import { DocumentReference } from "firebase/firestore";
import { IReportData } from "./report-interfaces";

export interface IUserCredentials {
  email: string;
  password: string;
}

export interface IUserData {
  rating: number;
  reports: IReportData[];
  reportsRef: DocumentReference<IReportData>[];
  fullName: string;
}

export interface IUser {
  displayName: string;
  email: string;
  uid: string;
}

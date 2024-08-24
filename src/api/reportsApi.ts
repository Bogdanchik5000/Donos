import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { IUser } from "../interfaces/user-interfaces";
import { db } from "../firebase";
import userApi from "./userApi";
import {
  IReportData,
  IReportDataForPublish,
} from "../interfaces/report-interfaces";

class ReportsApi {
  async addReport(
    reportMessage: string,
    department: string,
    allowPublish: boolean,
    isAnonim: boolean,
    fullName: string,
    user: IUser
  ) {
    const userRef = doc(db, "users", user.uid);
    const docRef = collection(db, "reports");

    const reportsDoc = await addDoc(docRef, {
      reportMessage,
      department,
      allowPublish,
      isAnonim,
      fullName,
      createdAt: serverTimestamp(),
      userRef,
    });

    await updateDoc(reportsDoc, {
      id: reportsDoc.id,
    });

    // await userApi.updateUserReports(user);

    const updatedReports = await this.getAllReports();
    return updatedReports;
  }

  async getAllReports() {
    const allReportsDoc = (await getDocs(collection(db, "reports"))).docs;
    let allReports = allReportsDoc.map((doc) => {
      const docData = doc.data();
      return { ...docData, id: doc.id };
    }) as IReportData[];

    allReports = allReports.sort((a, b) =>
      a.createdAt < b.createdAt ? 1 : -1
    );

    return allReports as IReportData[];
  }

  async getReportsById(user: IUser) {
    const userReportsDoc = await getDoc(doc(db, "users", user.uid));

    if (userReportsDoc.exists()) {
      const userReportsRef = userReportsDoc.data()
        .reportsRef as DocumentReference[];

      const userReports = await Promise.all(
        userReportsRef.map(async (doc) => {
          const docData = (await getDoc(doc)).data();
          return { ...docData, id: doc.id };
        })
      );

      return userReports as IReportData[];
    }
    return [];
  }

  async getReportById(id: string) {
    const reportDoc = await getDoc(doc(db, "reports", id));
    if (!reportDoc.exists()) throw new Error("Доноса с таким id не существует");
    return reportDoc.data();
  }

  async updateReport(newData: IReportDataForPublish, id: string) {
    const reportDoc = doc(db, "reports", id);

    await updateDoc(reportDoc, {
      reportMessage: newData.reportMessage,
      fullName: newData.fullName,
      department: newData.department,
    });

    const updatedReports = await this.getAllReports();
    return updatedReports;
  }

  async deleteReportById(user: IUser, id: string) {
    await deleteDoc(doc(db, "reports", id));
    await userApi.updateUserReports(user);

    const updatedReports = await this.getAllReports();
    return updatedReports;
  }
}

const reportsApi = new ReportsApi();

export default reportsApi;

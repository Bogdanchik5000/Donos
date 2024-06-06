import {
  DocumentReference,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { updateUserRating, updateUserReports } from "./user-manage";
import {
  IReportData,
  IReportDataForPublish,
} from "../interfaces/report-interfaces";

export async function addReport(
  reportMessage: string,
  department: string,
  allowPublish: boolean,
  isAnonim: boolean,
  fullName: string
) {
  const userId = auth.currentUser?.uid;
  if (!userId) throw new Error("Пользователь не авторизован");

  const userRef = doc(db, "users", userId);
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
  await updateUserReports();
}

export async function getAllReports() {
  const allReportsDoc = (await getDocs(collection(db, "reports"))).docs;
  let allReports = allReportsDoc.map((doc) => {
    const docData = doc.data();
    return { ...docData, id: doc.id };
  }) as IReportData[];

  allReports = allReports.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return allReports as IReportData[];
}

export async function getReportsById(userId: string) {
  const userReportsDoc = await getDoc(doc(db, "users", userId));

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

export async function getReportById(id: string) {
  const reportDoc = await getDoc(doc(db, "reports", id));
  if (!reportDoc.exists()) throw new Error("Доноса с таким id не существует");
  return reportDoc.data();
}

export async function updateReport(newData: IReportDataForPublish, id: string) {
  const reportDoc = doc(db, "reports", id);

  await updateDoc(reportDoc, {
    reportMessage: newData.reportMessage,
    fullName: newData.fullName,
    department: newData.department,
  });
}

export async function deleteReportById(id: string) {
  if (!id) throw new Error(`Доноса с id "${id}" не существует`);

  await deleteDoc(doc(db, "reports", id));
  await updateUserReports();
  await updateUserRating(-10);
}

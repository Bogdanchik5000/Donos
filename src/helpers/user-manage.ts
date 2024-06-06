import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db, provider } from "../firebase";
import { IUserCredentials, IUserData } from "../interfaces/user-interfaces";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { IReportData } from "../interfaces/report-interfaces";

export async function register({ email, password }: IUserCredentials) {
  await createUserWithEmailAndPassword(auth, email, password);
  await createUser();
}

export async function login({
  email,
  password,
}: IUserCredentials): Promise<void> {
  signInWithEmailAndPassword(auth, email, password);
}

export async function loginGoogle() {
  const { user } = await signInWithPopup(auth, provider);

  const userDoc = doc(db, "users", user.uid);

  if ((await getDoc(userDoc)).exists()) return;
  await createUser();
}

export async function logout() {
  await signOut(auth);
}

export async function createUser() {
  if (!auth.currentUser) throw new Error("Пользователь не авторизован");

  const uid = auth.currentUser.uid;

  await setDoc(doc(db, "users", uid), {
    fullName: "",
    rating: 0,
    reportsRef: [],
  });
}

export async function updateUserReports() {
  if (!auth.currentUser) throw new Error("Пользователь не авторизован");

  const reportsRef = collection(db, "reports");
  const userDoc = doc(db, "users", auth.currentUser.uid);

  const q = query(reportsRef, where("userRef", "==", userDoc));
  const userReportsRef = (await getDocs(q)).docs.map((doc) => doc.ref);

  await updateDoc(userDoc, {
    reportsRef: userReportsRef,
  });
}

export async function updateUserRating(rating: number) {
  if (!auth.currentUser) throw new Error("Пользователь не авторизован");

  const prevRating = (
    await getDoc(doc(db, "users", auth.currentUser.uid))
  ).data()!.rating as number;

  const newRating = (prevRating + rating).toFixed(2);

  await updateDoc(doc(db, "users", auth.currentUser.uid), {
    rating: +newRating,
  });
}

export async function getUserData(): Promise<IUserData> {
  if (!auth.currentUser) throw new Error("Пользователь не авторизован");

  const userDoc = doc(db, "users", auth.currentUser.uid);
  const userData = (await getDoc(userDoc)).data() as IUserData;

  const userReports = [] as IReportData[];

  for (const reportDoc of userData.reportsRef) {
    const reportData = (await getDoc(reportDoc)).data();
    if (!reportData) continue;

    const date = reportData.createdAt.toDate().toLocaleDateString();

    userReports.push({ ...reportData, formattedDate: date });
  }

  return { ...userData, reports: userReports };
}

export async function setUserName(name: string) {
  if (!auth.currentUser) throw new Error("Пользователь не авторизован");

  const userDoc = doc(db, "users", auth.currentUser.uid);
  await updateDoc(userDoc, {
    fullName: name,
  });
}

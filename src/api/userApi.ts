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
import { db } from "../firebase";
import { IUser, IUserData } from "../interfaces/user-interfaces";
import { IReportData } from "../interfaces/report-interfaces";

class UserApi {
  async createUser(user: IUser) {
    setDoc(doc(db, "users", user.uid), {
      fullName: "",
      rating: 0,
      reportsRef: [],
    });
  }

  async updateUserReports(user: IUser) {
    const reportsRef = collection(db, "reports");
    const userDoc = doc(db, "users", user.uid);

    const q = query(reportsRef, where("userRef", "==", userDoc));
    const userReportsRef = (await getDocs(q)).docs.map((doc) => doc.ref);

    await updateDoc(userDoc, {
      reportsRef: userReportsRef,
    });

    const updatedUser = await this.getUserData(user);
    return updatedUser;
  }

  async updateUserRating(user: IUser, rating: number) {
    const prevRating = (await getDoc(doc(db, "users", user.uid))).data()!
      .rating as number;

    const newRating = (prevRating + rating).toFixed(2);

    await updateDoc(doc(db, "users", user.uid), {
      rating: +newRating,
    });

    const updatedUser = await this.getUserData(user);
    return updatedUser;
  }

  async getUserData(user: IUser): Promise<IUserData> {
    const userDoc = doc(db, "users", user.uid);
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

  async updateUserName(user: IUser, name: string) {
    const userDoc = doc(db, "users", user.uid);
    await updateDoc(userDoc, {
      fullName: name,
    });

    const updatedName = (await this.getUserData(user)).fullName;
    return updatedName;
  }
}

const userApi = new UserApi();

export default userApi;

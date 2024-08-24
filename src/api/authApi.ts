import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { IUser, IUserCredentials } from "../interfaces/user-interfaces";
import { auth, db, provider } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import userApi from "./userApi";

class AuthApi {
  async register({ email, password }: IUserCredentials) {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await userApi.createUser(user as IUser);
  }

  async login({ email, password }: IUserCredentials) {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async loginGoogle() {
    const { user } = await signInWithPopup(auth, provider);

    const userDoc = doc(db, "users", user.uid);

    if ((await getDoc(userDoc)).exists()) return;
    await userApi.createUser(user as IUser);
  }

  async logout() {
    signOut(auth);
  }
}

const authApi = new AuthApi();

export default authApi;

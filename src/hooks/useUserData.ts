import { useEffect, useState } from "react";
import { getUserData } from "../helpers/user-manage";
import { IUserData } from "../interfaces/user-interfaces";

export default function useUserData(): {
  userData: IUserData;
  fetchData: () => Promise<void>;
  isLoading: boolean;
} {
  const [userData, setUserData] = useState<IUserData>({
    rating: 0,
    fullName: "",
    reports: [],
    reportsRef: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData() {
    setIsLoading(true);
    const userData = await getUserData();

    setUserData(userData);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return { userData, fetchData, isLoading };
}

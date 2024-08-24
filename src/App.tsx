import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProtectedRoute from "./Providers/AuthProtectedRoute";
import ReportPage from "./pages/ReportPage/ReportPage";
import Auth from "./pages/Auth/Auth";
import Profile from "./pages/Profile/Profile";
import ReportEdit from "./pages/ReportEdit/ReportEdit";
import AuthLoadingProvider from "./Providers/AuthLoadingProvider";
import { useAppDispatch } from "./hooks/hooks.redux.";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { authSliceActions } from "./store/slices/authSlice";
import Layout from "./layouts/Layout";
import MainPage from "./pages/MainPage/MainPage";
import reportsApi from "./api/reportsApi";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          authSliceActions.setUser({
            displayName: user.displayName ?? "",
            email: user.email ?? "",
            uid: user.uid,
          })
        );
      } else {
        dispatch(authSliceActions.setUser(null));
      }
    });
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <MainPage />,
        },
        {
          path: "/report",
          element: (
            <AuthProtectedRoute>
              <ReportPage />
            </AuthProtectedRoute>
          ),
        },
        {
          path: "/auth",
          element: <Auth />,
        },
        {
          path: "/profile",
          element: (
            <AuthProtectedRoute>
              <Profile />
            </AuthProtectedRoute>
          ),
        },
        {
          path: "/edit/:reportId",
          element: <ReportEdit />,
          loader: async ({ params }) => {
            const reportData = await reportsApi.getReportById(params.reportId!);
            return reportData;
          },
        },
      ],
    },
  ]);

  return (
    <AuthLoadingProvider>
      <RouterProvider router={router} />
    </AuthLoadingProvider>
  );
}

import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import MainPage from "./pages/MainPage/MainPage";
import ReportPage from "./pages/ReportPage/ReportPage";
import Auth from "./pages/Auth/Auth";
import AuthContext from "./Providers/AuthContext";
import Profile from "./pages/Profile/Profile";
import AuthProtectedRoute from "./Providers/AuthProtectedRoute";
import ReportsDataProvider from "./Providers/ReportsDataProvider";
import ReportEdit from "./pages/ReportEdit/ReportEdit";
import { getReportById } from "./helpers/report-manage";

const router = createBrowserRouter([
  {
    path: "",
    element: <MainPage />,
    children: [
      {
        path: "report",
        element: (
          <AuthProtectedRoute>
            <ReportPage />
          </AuthProtectedRoute>
        ),
      },
      {
        path: "auth",
        element: <Auth />,
      },
      {
        path: "profile",
        element: (
          <AuthProtectedRoute>
            <Profile />
          </AuthProtectedRoute>
        ),
      },
      {
        path: "edit/:reportId",
        element: <ReportEdit />,
        loader: async ({ params }) => {
          const reportData = await getReportById(params.reportId!);
          return reportData;
        },
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AuthContext>
    <ReportsDataProvider>
      <RouterProvider router={router} />
    </ReportsDataProvider>
  </AuthContext>
);

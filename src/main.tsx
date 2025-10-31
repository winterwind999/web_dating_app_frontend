import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import InitialLoading from "./components/InitialLoading";
import NotFound from "./components/NotFound";
import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import TokenExpired from "./components/TokenExpired";
import Unauthorized from "./components/Unauthorized";
import "./index.css";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/dashboard/Dashboard";
import Login from "./pages/landing/Login";
import RootLayout from "./pages/landing/RootLayout";
import SignUp from "./pages/landing/SignUp";
import Chats from "./pages/user/chats/Chats";
import Feeds from "./pages/user/feeds/Feeds";
import Profile from "./pages/user/profile/Profile";
import UserLayout from "./pages/user/UserLayout";
import { ThemeProvider } from "./utils/themeProvider";

if (import.meta.env.VITE_APP_ENV === "production") {
  disableReactDevTools();
}

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <InitialLoading /> },
      { path: "login", element: <Login /> },
      { path: "sign-up", element: <SignUp /> },
      {
        path: "user",
        element: <UserLayout />,
        children: [
          {
            element: <PersistLogin />,
            children: [
              {
                element: <RequireAuth />,
                children: [
                  { index: true, element: <Feeds /> },
                  { path: "chats", element: <Chats /> },
                  { path: "profile", element: <Profile /> },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "admin",
        element: <AdminLayout />,
        children: [
          {
            element: <PersistLogin />,
            children: [
              {
                element: <RequireAuth />,
                children: [{ index: true, element: <Dashboard /> }],
              },
            ],
          },
        ],
      },

      { path: "unauthorized", element: <Unauthorized /> },
      { path: "token-expired", element: <TokenExpired /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          gutter={8}
          containerClassName=""
          containerStyle={{}}
          toastOptions={{
            className: "",
            duration: 3000,
            removeDelay: 1000,
          }}
        />
      </ThemeProvider>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  </StrictMode>,
);

import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { isLoggedIn } from "./utils/loginUtil";
import { ProtectedRoute } from "./routes/protectedRoute";
import { LoggedInRoute } from "./routes/loggedInRoute";
import LoginView from "./components/account/login";
import RegisterView from "./components/account/register";
import { JobsView } from "./components/jobs/jobs";
import { JobView } from "./components/jobs/job";
import { SettingsView } from "./components/settings/settings";
import { NotFound } from "./components/notfound";
import { Toaster } from "react-hot-toast";
import { User } from "./components/admin/user";
import { Dashboard } from "./components/admin/dashboard";

const root = ReactDOM.createRoot(document.getElementById("root"));
const loggedIn = isLoggedIn();

root.render(
  <React.StrictMode>
    <Toaster position="top-right" reverseOrder={false} />
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <App location={window.location} />
            </ProtectedRoute>
          }
        />
        <Route path="jobs" element={<JobsView location={window.location} />} />
        <Route
          path="jobs/:jobID"
          element={<JobView location={window.location} />}
        />
        <Route
          path="settings"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <SettingsView location={window.location} />
            </ProtectedRoute>
          }
        />
        <Route
          path="login"
          element={
            <LoggedInRoute loggedIn={loggedIn}>
              <LoginView />
            </LoggedInRoute>
          }
        />
        <Route
          path="register"
          element={
            <LoggedInRoute loggedIn={loggedIn}>
              <RegisterView />
            </LoggedInRoute>
          }
        />
        <Route
          path="admin/dashboard"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/user/:id"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <User />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

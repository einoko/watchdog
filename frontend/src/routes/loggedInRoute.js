import { Navigate } from "react-router-dom";

export const LoggedInRoute = ({ loggedIn, children }) => {
  if (loggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

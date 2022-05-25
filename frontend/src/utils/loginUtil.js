import Cookies from "js-cookie";

export const getJWT = () => {
  return Cookies.get("jwt");
};

export const setJWT = (jwt) => {
  return Cookies.set("jwt", jwt, {
    expires: Number.parseInt(process.env.JWT_EXPIRES_IN) || 30,
  });
};

export const removeJWT = () => {
  return Cookies.remove("jwt");
};

export const isLoggedIn = () => {
  return !!getJWT();
};

import { apiPath } from "./apiPath";
import { removeEmpty } from "./bodyUtils";
import { getJWT } from "./loginUtil";

export const JsonRequest = async (
  method,
  url,
  body = null,
  remove_empty = false
) => {
  const options = {
    method,
  };

  const headers = {
    "Content-Type": "application/json",
  };

  options.headers = headers;

  if (getJWT()) {
    headers.Authorization = getJWT();
  }

  if (body) {
    if (remove_empty) {
      options.body = JSON.stringify(removeEmpty(body));
    } else {
      options.body = JSON.stringify(body);
    }
  }

  const response = await fetch(`${apiPath()}${url}`, options);
  return response.json();
};

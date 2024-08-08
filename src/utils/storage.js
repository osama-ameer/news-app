import Cookies from "js-cookie";

export const setCookie = (key, data) => {
  if (typeof data === "object") data = JSON.stringify(data);
  Cookies.set(key, data);
};

export const getCookie = (key) => {
  return Cookies.get(key);
};

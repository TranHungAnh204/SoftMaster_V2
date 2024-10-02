import { USER_INFO_STORAGE_KEY } from "../constants/constants.js";

const checkLogin = () => {
  const userInfo = localStorage.getItem(USER_INFO_STORAGE_KEY);
  if (!userInfo) {
    window.location.href = "log-in.html";
  }

  const userInfoParse = JSON.parse(userInfo);
  const avatarElm = document.querySelector(".avatar");
  avatarElm.src = userInfoParse.avatar;
};

checkLogin();

// logout
const signOutBtn = document.getElementById("sign-out");
signOutBtn.addEventListener("click", () => {
  localStorage.removeItem(USER_INFO_STORAGE_KEY);

  window.location.href = "log-in.html";
});

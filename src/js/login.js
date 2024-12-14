import { request } from "../utils/request.js";
import { USER_INFO_STORAGE_KEY } from "../constants/constants.js";

const loginForm = document.getElementById("login-form");
const onLogin = async (e) => {
  e.preventDefault();

  const emailElm = loginForm.querySelector("#email");
  const passwordElm = loginForm.querySelector("#password");

  // Kiểm tra đầu vào
  if (!emailElm.value.trim() || !passwordElm.value.trim()) {
    alert("Vui lòng nhập email và mật khẩu");
    return;
  }
  if (!/\S+@\S+\.\S+/.test(emailElm.value)) {
    alert("Email không đúng định dạng");
    return;
  }
  
  try {
    const payload = {
      email: emailElm.value,
      password: passwordElm.value,
    };

    const res = await request({
      url: "/teacher/login",
      method: "POST",
      body: JSON.stringify(payload),
    });

    localStorage.setItem(USER_INFO_STORAGE_KEY, JSON.stringify(res.teacher));
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
};

loginForm.addEventListener("submit", onLogin);

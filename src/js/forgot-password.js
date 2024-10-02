import { request } from "../utils/request.js";

const sendOtpElm = document.querySelector(".send-otp");
const verifyOtp = document.querySelector(".verify-otp");
const resetPassword = document.querySelector(".reset-password");
const emailElm = document.querySelector("#email");

let teacherId;

// send otp
sendOtpElm.addEventListener("click", async () => {
  try {
    const res = await request({
      url: "/teacher/forgot-password",
      method: "POST",
      body: JSON.stringify({
        email: emailElm.value,
      }),
    });

    alert(res.message);
    teacherId = res.teacherID;
  } catch (error) {
    alert(error.message);
  }
});

// verify otp
const verifyOtpBtn = document.querySelector(".verify-otp-btn");
verifyOtpBtn.addEventListener("click", async () => {
  const otpVal = document.querySelector("#otp").value;

  try {
    const res = await request({
      url: `/teacher/verify-otp-forgotpass/${teacherId}`,
      method: "POST",
      body: JSON.stringify({
        email: emailElm.value,
        otp: otpVal,
      }),
    });

    alert(res.message);

    verifyOtp.classList.add("d-none");
    resetPassword.classList.remove("d-none");
  } catch (error) {
    alert(error.message);
  }
});

// reset password
const resetPasswordForm = document.getElementById("reset-password-form");
resetPasswordForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const newPasswordVal = resetPasswordForm.querySelector("#new-password").value;
  const confirmPasswordVal =
    resetPasswordForm.querySelector("#confirm-password").value;

  if (newPasswordVal !== confirmPasswordVal) {
    alert("Mật khẩu không trùng khớp");
    return;
  }

  try {
    const res = await request({
      url: `/teacher/reset-password/${teacherId}`,
      method: "PUT",
      body: JSON.stringify({
        newPassword: newPasswordVal,
      }),
    });

    alert(res.message);
    window.location.href = "log-in.html";
  } catch (error) {
    alert(error.message);
  }
});

import { request } from "../utils/request.js";
import { USER_INFO_STORAGE_KEY } from "../constants/constants.js";

const user = JSON.parse(localStorage.getItem(USER_INFO_STORAGE_KEY));

const renderData = async () => {
  try {
    const [profile, { followerCount }] = await Promise.all([
      request({
        url: `/teacher/getTeacherByID/${user._id}`,
      }),
      request({
        url: `/followTeacher/getFollowerCount/${user._id}`,
      }),
    ]);

    // Đổ dữ liệu vào giao diện
    document.getElementById("name").textContent = profile.name;
    document.getElementById("email").textContent = profile.email;
    document.getElementById("phone").textContent = profile.phone;
    document.getElementById("avatar").src = profile.avatar;
    document.getElementById("major").textContent = profile.major;
    document.getElementById("slogan").textContent = `"${profile.slogan}"`;
    document.getElementById("gender").textContent = profile.gender;
    document.getElementById("followers").textContent = followerCount;
  } catch (error) {
    console.log(error);
  }
};

renderData();

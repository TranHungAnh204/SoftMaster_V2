import { USER_INFO_STORAGE_KEY } from "../constants/constants.js";
import { request } from "../utils/request.js";
import formatPrice from "../utils/formatPrice.js";

const user = JSON.parse(localStorage.getItem(USER_INFO_STORAGE_KEY));

// list course
const courseList = document.querySelector(".course-list");
if (courseList) {
  const fetchCourses = async () => {
    try {
      const res = await request({
        url: `/course/getCourseByTeacherID/${user._id}`,
      });

      return res;
    } catch (error) {
      return [];
    }
  };

  const renderCourse = (data) => {
    const htmlStr = data
      .map(
        (it) => `
          <tr data-id="${it._id}">
            <td>
              <img
                src=${it.img}
                alt="${it.name}"
                class="course-img"
                style="width: 80px; height: 80px"
              />
            </td>
            <td>${it.name}</td>
            <td>${it.describe.slice(0, 50)}...</td>
            <td>${
              it.isBlock
                ? "<button class='btn btn-success btn-sm'>Kích hoạt</button>"
                : "<button class='btn btn-danger btn-sm'>Tạm khoá</button>"
            }</td>
            <td>
              <div class="d-flex align-items-center">
                <a
                  href="./chitiet-khoahoc.html?id=${it._id}"
                  class="btn btn-info btn-sm"
                  style="white-space: nowrap;"
                  >Chi tiết</a
                >
              </div>
            </td>
          </tr>
        `
      )
      .join(" ");

    courseList.innerHTML = htmlStr;
  };
  const data = await fetchCourses();
  renderCourse(data);
}

// update course
const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get("id");

const courseStats = document.querySelector(".course-stats");

if (courseStats) {
  const title = courseStats.querySelector(".course-name");

  try {
    // hiển thị tên khoá học
    const courseDetail = await request({
      url: `/course/getDetailByCourseID/${id}`,
    });

    title.innerHTML = `Khoá học: ${courseDetail.name}`;

    // số lượng người tham gia
    const enrolledUsers = await request({
      url: `/enrollCourse/countEnrolledUsers/${id}`,
    });
    courseStats.querySelector(".enrolled-user").innerHTML = enrolledUsers.count;

    // trung bình rating
    const avgRating = await request({
      url: `/feedbackCourse/averageRatingByCourseID/${id}`,
    });
    courseStats.querySelector(
      ".avg-rating"
    ).innerHTML = `${avgRating.averageRating}/5`;

    // số lượt đánh giá
    const feedbackCount = await request({
      url: `/feedbackCourse/countFeedbackByCourseID/${id}`,
    });
    courseStats.querySelector(".feedback-count").innerHTML =
      feedbackCount.count;

    // doanh thu
    const revenue = await request({
      url: `/payment/total-revenue-by-course/${id}`,
    });
    courseStats.querySelector(".revenue").innerHTML = `${formatPrice(
      revenue.totalRevenue
    )}`;

    // tổng số lượt bán
    const sellCount = await request({
      url: `/payment/total-sold-by-course/${id}`,
    });
    courseStats.querySelector(".sell-count").innerHTML = sellCount.totalSold;

    // danh sách đánh giá
    const feedbacks = await request({
      url: `/feedbackCourse/getFeedbackByCourseID/${id}`,
    });

    const htmlStr = feedbacks
      .map(
        (it) => `
          <tr data-id="${it._id}">
            <td>${it.feedbackDetail.content}</td>
            <td>${it.feedbackDetail.rating}/5</td>
            <td>${dayjs(it.feedbackDetail.createdAt).format(
              "DD/MM/YYYY HH:mm:ss"
            )}</td>
          </tr>
        `
      )
      .join(" ");
    courseStats.querySelector(".feedback-list").innerHTML = htmlStr;
  } catch (error) {
    console.log(error);
  }
}

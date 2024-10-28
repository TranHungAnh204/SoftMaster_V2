import { request } from "../utils/request.js";

// lesson list
const deleteLesson = async (id) => {
  const isConfirm = confirm("Bạn có chắc chắn muốn xoá bài học này không?");

  if (isConfirm) {
    try {
      await request({
        url: `/lesson/delete/${id}`,
        method: "DELETE",
      });
      const lessonItem = document.querySelector(`[data-id="${id}"]`);
      lessonItem.remove();

      alert("Xoá bài học thành công");
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại");
    }
  }
};
window.deleteLesson = deleteLesson;

const lessonList = document.querySelector(".lesson-list");
if (lessonList) {
  const fetchLessons = async () => {
    try {
      const res = await request({
        url: `/lesson/getAll`,
      });

      return res;
    } catch (error) {
      return [];
    }
  };

  const renderLesson = (data) => {
    const htmlStr = data
      .map(
        (it, index) => `
          <tr data-id="${it._id}">
            <td>${index + 1}</td>
            <td>${it.title}</td>
            <td>
              <div class="d-flex align-items-center">
                <a
                  href="./update-baihoc.html?id=${it._id}"
                  class="btn btn-warning btn-sm"
                  style="white-space: nowrap;"
                  >Cập nhật</a
                >
                <a
                  href="./ds-video-bai-hoc.html?lesson=${it._id}"
                  class="btn btn-info btn-sm ms-2"
                  style="white-space: nowrap;"
                  >DS video</a
                >
                <button
                  class="btn btn-danger btn-sm ms-2"
                  onclick="deleteLesson('${it._id}')"
                >
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        `
      )
      .join(" ");

    lessonList.innerHTML = htmlStr;
  };
  const data = await fetchLessons();
  renderLesson(data);
}

// add lesson
const renderCourseSelect = async () => {
  const courseSelect = document.getElementById("course");

  try {
    const res = await request({
      url: "/course/getAll",
    });

    const htmlStr = res
      .map((it) => `<option value=${it._id}>${it.name}</option>`)
      .join("");
    courseSelect.innerHTML += htmlStr;
  } catch (error) {
    console.log("Failed to get course list");
  }
};

const addLessonForm = document.querySelector(".add-lesson-form");
if (addLessonForm) {
  renderCourseSelect();

  addLessonForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = addLessonForm.querySelector("#lessonName").value;
    const courseId = addLessonForm.querySelector("#course").value;

    try {
      const payload = {
        title: name,
        courseID: courseId,
      };

      await request({
        url: `/lesson/add`,
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Thêm bài học thành công");
      window.location.href = "ds-baihoc.html";
    } catch (error) {
      alert("Không thể thêm bài học");
    }
  });
}

// update lesson
const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get("id");

const updateLessonForm = document.querySelector(".update-lesson-form");

const renderFormData = async () => {
  try {
    const res = await request({
      url: `/lesson/getDetail/${id}`,
    });

    updateLessonForm.querySelector("#lessonName").value = res.title;
    updateLessonForm.querySelector("#course").value = res.courseID;
  } catch (error) {
    console.log("Failed");
  }
};

if (updateLessonForm) {
  await renderCourseSelect();

  // fill data to form
  renderFormData();

  updateLessonForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = updateLessonForm.querySelector("#lessonName").value;
    const course = updateLessonForm.querySelector("#course").value;

    try {
      const payload = {
        title,
        courseID: course,
      };

      await request({
        url: `/lesson/update/${id}`,
        method: "PUT",
        body: JSON.stringify(payload),
      });

      alert("Cập nhật bài học thành công");
      window.location.href = "ds-baihoc.html";
    } catch (error) {
      alert("Không thể cập nhật bài học");
    }
  });
}

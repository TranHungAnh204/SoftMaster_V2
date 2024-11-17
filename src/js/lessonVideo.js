import { request } from "../utils/request.js";

const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get("id");
const lesson = searchParams.get("lesson");

// lesson video list
const deleteLessonVideo = async (id) => {
  const isConfirm = confirm(
    "Bạn có chắc chắn muốn xoá video bài học này không?"
  );

  if (isConfirm) {
    try {
      await request({
        url: `/lessonVideo/delete/${id}`,
        method: "DELETE",
      });
      const lessonVideoItem = document.querySelector(`[data-id="${id}"]`);
      lessonVideoItem.remove();

      alert("Xoá video bài học thành công");
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại");
    }
  }
};
window.deleteLessonVideo = deleteLessonVideo;

const lessonVideoList = document.querySelector(".lesson-video-list");
if (lessonVideoList) {
  const fetchLessonVideos = async () => {
    try {
      const url = lesson
        ? `/lessonVideo/getLessonVideoByLessonID/${lesson}`
        : "/lessonVideo/getAll";

      const res = await request({
        url,
      });

      return res;
    } catch (error) {
      return [];
    }
  };

  const renderLessonVideo = (data) => {
    const htmlStr = data
      .map(
        (it, index) => `
          <tr data-id="${it._id}">
            <td>${index + 1}</td>
            <td>${it.title}</td>
            <td>${it.lessonID?.title ?? ""}</td>
            <td>
              <a href=${
                it.video
              } target="_blank" style="white-space: nowrap;">Xem video</a>
            </td>
            <td>
              <div class="d-flex align-items-center">
                <a
                  href="./update-video-bai-hoc.html?id=${it._id}"
                  class="btn btn-warning btn-sm"
                  style="white-space: nowrap;"
                  >Cập nhật</a
                >
                <button
                  class="btn btn-danger btn-sm ms-2"
                  onclick="deleteLessonVideo('${it._id}')"
                >
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        `
      )
      .join(" ");

    lessonVideoList.innerHTML = htmlStr;
  };
  const data = await fetchLessonVideos();
  renderLessonVideo(data);
}

// add lesson video
const renderLessonSelect = async () => {
  const lessonSelect = document.getElementById("lesson");

  try {
    const res = await request({
      url: "/lesson/getAll",
    });

    const htmlStr = res
      .map((it) => `<option value=${it._id}>${it.title}</option>`)
      .join("");
    lessonSelect.innerHTML += htmlStr;
  } catch (error) {
    console.log("Failed to get lesson list");
  }
};

const addLessonVideoForm = document.querySelector(".add-lesson-video-form");
if (addLessonVideoForm) {
  renderLessonSelect();

  addLessonVideoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = addLessonVideoForm.querySelector("#name").value;
    const lessonId = addLessonVideoForm.querySelector("#lesson").value;
    const video = addLessonVideoForm.querySelector("#url").value;

    if (!name || !lessonId || !video) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const payload = {
        title: name,
        video,
        lessonID: lessonId,
      };

      await request({
        url: `/lessonVideo/add`,
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Thêm video bài học thành công");
      window.location.href = "ds-video-bai-hoc.html";
    } catch (error) {
      alert("Không thể thêm video bài học");
    }
  });
}

// update lesson video
const updateLessonVideoForm = document.querySelector(
  ".update-lesson-video-form"
);

const renderFormData = async () => {
  try {
    const res = await request({
      url: `/lessonVideo/getDetail/${id}`,
    });

    updateLessonVideoForm.querySelector("#name").value = res.title;
    updateLessonVideoForm.querySelector("#url").value = res.video;
    updateLessonVideoForm.querySelector("#lesson").value = res.lessonID._id;
  } catch (error) {
    console.log("Failed");
  }
};

if (updateLessonVideoForm) {
  await renderLessonSelect();

  // fill data to form
  renderFormData();

  updateLessonVideoForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = updateLessonVideoForm.querySelector("#name").value;
    const lessonId = updateLessonVideoForm.querySelector("#lesson").value;
    const video = updateLessonVideoForm.querySelector("#url").value;

    if (!name || !lessonId || !video) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const payload = {
        title: name,
        video,
        lessonID: lessonId,
      };

      await request({
        url: `/lessonVideo/update/${id}`,
        method: "PUT",
        body: JSON.stringify(payload),
      });

      alert("Cập nhật video bài học thành công");
      window.location.href = "ds-video-bai-hoc.html";
    } catch (error) {
      alert("Không thể cập nhật video bài học");
    }
  });
}

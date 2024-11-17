import { request } from "../utils/request.js";

// test list
const deleteTest = async (id) => {
  const isConfirm = confirm("Bạn có chắc chắn muốn xoá bài test này không?");

  if (isConfirm) {
    try {
      await request({
        url: `/test/delete/${id}`,
        method: "DELETE",
      });
      const testItem = document.querySelector(`[data-id="${id}"]`);
      testItem.remove();

      alert("Xoá bài test thành công");
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại");
    }
  }
};
window.deleteTest = deleteTest;

const testList = document.querySelector(".test-list");
if (testList) {
  const fetchTestList = async () => {
    try {
      const res = await request({
        url: `/test/getAll`,
      });

      return res;
    } catch (error) {
      return [];
    }
  };

  const renderTest = (data) => {
    const htmlStr = data
      .map(
        (it, index) => `
          <tr data-id="${it._id}">
            <td>${index + 1}</td>
            <td>${it.title}</td>
            <td>
              <div class="d-flex align-items-center">
                <a
                  href="./update-baitest.html?id=${it._id}"
                  class="btn btn-warning btn-sm"
                  style="white-space: nowrap;"
                  >Cập nhật</a
                >

                <a
                  href="./ds-cau-hoi.html?test=${it._id}"
                  class="btn btn-info btn-sm ms-2"
                  style="white-space: nowrap;"
                  >DS câu hỏi</a
                >

                <button
                  class="btn btn-danger btn-sm ms-2"
                  onclick="deleteTest('${it._id}')"
                >
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        `
      )
      .join(" ");

    testList.innerHTML = htmlStr;
  };
  const data = await fetchTestList();
  renderTest(data);
}

// add test
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

const addTestForm = document.querySelector(".add-test-form");
if (addTestForm) {
  renderLessonSelect();

  addTestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = addTestForm.querySelector("#title").value;
    const lessonId = addTestForm.querySelector("#lesson").value;

    if (!title || !lessonId) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const payload = {
        title,
        lessonID: lessonId,
      };

      await request({
        url: `/test/add`,
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Thêm bài test thành công");
      window.location.href = "ds-test.html";
    } catch (error) {
      alert("Không thể thêm bài test");
    }
  });
}

// update test
const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get("id");

const updateTestForm = document.querySelector(".update-test-form");

const renderFormData = async () => {
  try {
    const res = await request({
      url: `/test/getDetail/${id}`,
    });

    updateTestForm.querySelector("#title").value = res.title;
    updateTestForm.querySelector("#lesson").value = res.lessonID;
  } catch (error) {
    console.log("Failed");
  }
};

if (updateTestForm) {
  await renderLessonSelect();

  // fill data to form
  renderFormData();

  updateTestForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = updateTestForm.querySelector("#title").value;
    const lessonId = updateTestForm.querySelector("#lesson").value;

    if (!title || !lessonId) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const payload = {
        title,
        lessonID: lessonId,
      };

      await request({
        url: `/test/update/${id}`,
        method: "PUT",
        body: JSON.stringify(payload),
      });

      alert("Cập nhật bài test thành công");
      window.location.href = "ds-test.html";
    } catch (error) {
      alert("Không thể cập nhật bài test");
    }
  });
}

import { USER_INFO_STORAGE_KEY } from "../constants/constants.js";
import formatPrice from "../utils/formatPrice.js";
import { request } from "../utils/request.js";
import uploadImage from "../utils/uploadImage.js";

const user = JSON.parse(localStorage.getItem(USER_INFO_STORAGE_KEY));

// list course
// const deleteCourse = async (id) => {
//   const isConfirm = confirm("Bạn có chắc chắn muốn xoá khoá học này không?");

//   if (isConfirm) {
//     try {
//       await request({
//         url: `/course/delete/${id}`,
//         method: "DELETE",
//       });
//       const courseItem = document.querySelector(`[data-id="${id}"]`);
//       courseItem.remove();

//       alert("Xoá khoá học thành công");
//     } catch (error) {
//       alert("Có lỗi xảy ra, vui lòng thử lại");
//     }
//   }
// };
// window.deleteCourse = deleteCourse;

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
                style="width: 100px; height: 100px"
              />
            </td>
            <td>${it.name}</td>
            <td>
              <a href="ds-baihoc.html?course=${it._id
          }" style="white-space: nowrap;">Xem bài học</a>
            </td> 
            <td>
              <a href="dssv-thamgia-khoahoc.html?course=${it._id
          }" style="white-space: nowrap;">DS Sinh viên</a>
            </td>
            <td>${it.describe.slice(0, 50)}...</td>
            <td>${formatPrice(it.price)}</td>
            <td>${it.isBlock
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
                <a
                  href="./update-khoahoc.html?id=${it._id}"
                  class="btn btn-warning btn-sm ms-2"
                  style="white-space: nowrap;"
                  >Cập nhật</a
                >
      
              </div>
            </td>
          </tr>
        `
      )
      .join(" ");
    {/* <button
                  class="btn btn-danger btn-sm ms-2"
                  onclick="deleteCourse('${it._id}')"
                >
                  Xóa
                </button> */}
    courseList.innerHTML = htmlStr;
  };
  const data = await fetchCourses();
  renderCourse(data);

  // tìm kiếm
  const searchForm = document.querySelector(".search-form");
  searchForm.onsubmit = async (e) => {
    e.preventDefault();

    const searchStr = searchForm.querySelector("#searchInput").value;

    try {
      const res = await request({
        url: "/course/search",
        method: "POST",
        body: JSON.stringify({ name: searchStr }),
      });

      renderCourse(res);
    } catch (error) {
      console.log("Failed to search");
    }
  };
}

// add course
const addCourseForm = document.querySelector(".add-course-form");
if (addCourseForm) {
  addCourseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = addCourseForm.querySelector("#courseName").value;
    const description = addCourseForm.querySelector("#courseDescription").value;
    const price = addCourseForm.querySelector("#coursePrice").value;
    const image = addCourseForm.querySelector("#courseImage");

    if (!name || !description || !price || !image.files.length) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const imageUrl = await uploadImage(image.files[0]);

      const payload = {
        name,
        img: imageUrl,
        describe: description,
        price,
      };

      await request({
        url: `/course/add/${user._id}`,
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert("Thêm khoá học thành công");
      window.location.href = "dskhoahoc.html";
    } catch (error) {
      alert("Không thể thêm khoá học");
    }
  });
}

// update course
const searchParams = new URLSearchParams(window.location.search);
const id = searchParams.get("id");

const updateCourseForm = document.querySelector(".update-course-form");

const renderFormData = async () => {
  try {
    const res = await request({
      url: `/course/getDetailByCourseID/${id}`,
    });

    const preview = updateCourseForm.querySelector(".preview");
    preview.classList.remove("d-none");
    preview.querySelector("img").src = res.img;

    updateCourseForm.querySelector("#courseName").value = res.name;
    updateCourseForm.querySelector("#courseDescription").value = res.describe;
    updateCourseForm.querySelector("#coursePrice").value = res.price;
  } catch (error) {
    console.log("Failed");
  }
};

if (updateCourseForm) {
  // fill data to form
  renderFormData();

  updateCourseForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = updateCourseForm.querySelector("#courseName").value;
    const description =
      updateCourseForm.querySelector("#courseDescription").value;
    const price = updateCourseForm.querySelector("#coursePrice").value;
    const image = updateCourseForm.querySelector("#courseImage");

    if (!name || !description || !price) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      let imageUrl;

      if (image.files.length > 0) {
        imageUrl = await uploadImage(image.files[0]);
      }

      const payload = {
        name,
        img: imageUrl,
        describe: description,
        price,
      };

      await request({
        url: `/course/update/${id}`,
        method: "PUT",
        body: JSON.stringify(payload),
      });

      alert("Cập nhật khoá học thành công");
      window.location.href = "dskhoahoc.html";
    } catch (error) {
      alert("Không thể cập nhật khoá học");
    }
  });
}

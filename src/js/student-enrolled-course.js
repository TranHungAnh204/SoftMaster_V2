import { request } from "../utils/request.js";

const searchParams = new URLSearchParams(window.location.search);
const course = searchParams.get("course");

const studentList = document.querySelector(".student-enrolled-course");
if (studentList) {
  const fetchStudentEnrolledCourse = async () => {
    try {
      const r = await request({
        url: `/enrollCourse/getUserEnrolledInCourse/${course}`,
      });

      const students = r?.count?.enrolledStudents;
      const res = await Promise.all(
        students.map(async (it) => {
          const r = await request({
            url: `/score/getScoreByUserID/${it.userID}`,
          });

          const scores = r.scores;
          return {
            ...it,
            scores,
          };
        })
      );

      return res;
    } catch (error) {
      return [];
    }
  };

  const renderData = (data) => {
    const htmlStr = data
      .map(
        (it, index) => `
          <tr data-id="${it._id}">
            <td>${index + 1}</td>
            <td>${it.name}</td>
            <td>${it.email}</td>
            <td>
              <div class="d-flex align-items-center">
                <button
                  class="btn btn-info btn-sm"
                  style="white-space: nowrap;"
                  data-bs-toggle="modal" data-bs-target="#${it.userID}"
                >
                  Bảng điểm
                </button>

                <div class="modal fade" id="${it.userID}">
                  <div class="modal-dialog modal-lg modal-dialog-centered">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h1 class="modal-title fs-5">Bảng điểm của SV: ${
                          it.name
                        }</h1>
                        <button
                          type="button"
                          class="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div class="modal-body">
                        <table class="table table-striped">
                          <thead>
                            <tr>
                              <th>STT</th>
                              <th>Điểm</th>
                              <th>Bài Test</th>
                            </tr>
                          </thead>
                          <tbody>
                            ${it.scores.map(
                              (x, idx) => `<tr>
                              <td>${idx + 1}</td>
                              <td>${x.score}</td>
                              <td>${x.testID._id}</td>
                            </tr>`
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div class="modal-footer">
                        <button
                          type="button"
                          class="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        `
      )
      .join(" ");

    studentList.innerHTML = htmlStr;
  };
  const data = await fetchStudentEnrolledCourse();
  renderData(data);
}

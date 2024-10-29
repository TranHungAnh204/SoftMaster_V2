import { request } from "../utils/request.js";
import { USER_INFO_STORAGE_KEY } from "../constants/constants.js";

const user = JSON.parse(localStorage.getItem(USER_INFO_STORAGE_KEY));

const toLetters = (num) => {
  "use strict";
  var mod = num % 26,
    pow = (num / 26) | 0,
    out = mod ? String.fromCharCode(64 + mod) : (--pow, "Z");
  return pow ? toLetters(pow) + out : out;
};

const searchParams = new URLSearchParams(window.location.search);
const test = searchParams.get("test");
const id = searchParams.get("id");

// questions list
const deleteQuestion = async (id) => {
  const isConfirm = confirm("Bạn có chắc chắn muốn xoá câu hỏi này không?");

  if (isConfirm) {
    try {
      await request({
        url: `/question/deletequestion/${test}/${id}`,
        method: "DELETE",
      });
      const questionItem = document.querySelector(`[data-id="${id}"]`);
      questionItem.remove();

      alert("Xoá câu hỏi thành công");
    } catch (error) {
      alert("Có lỗi xảy ra, vui lòng thử lại");
    }
  }
};
window.deleteQuestion = deleteQuestion;

const questionList = document.querySelector(".question-list");
const addQuestionBtn = document.querySelector(".add-question-btn");
if (questionList) {
  const fetchQuestionList = async () => {
    try {
      const res = await request({
        url: `/question/getAll/${test}`,
      });

      return res.questions;
    } catch (error) {
      return [];
    }
  };

  const renderQuestion = (data) => {
    const renderAnswers = (answers) => {
      return answers
        .map(
          (it, index) =>
            `<p>${toLetters(index + 1)}. ${it.text} ${
              it.isCorrect ? "(Đáp án đúng)" : ""
            }</p>`
        )
        .join("");
    };

    const htmlStr = data
      .map(
        (it, index) => `
          <tr data-id="${it.questionID}">
            <td>${index + 1}</td>
            <td>${it.title}</td>
            <td>${renderAnswers(it.options)}</td>
            <td>
              <div class="d-flex align-items-center">
                <a
                  href="./update-cau-hoi.html?id=${it.questionID}&test=${test}"
                  class="btn btn-warning btn-sm"
                  style="white-space: nowrap;"
                  >Cập nhật</a
                >

                <button
                  class="btn btn-danger btn-sm ms-2"
                  onclick="deleteQuestion('${it.questionID}')"
                >
                  Xóa
                </button>
              </div>
            </td>
          </tr>
        `
      )
      .join(" ");

    questionList.innerHTML = htmlStr;
  };
  const data = await fetchQuestionList();
  renderQuestion(data);

  addQuestionBtn.addEventListener("click", () => {
    window.location.href = `./them-cau-hoi.html?test=${test}`;
  });
}

// add question
const addQuestionForm = document.querySelector(".add-question-form");
if (addQuestionForm) {
  addQuestionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = addQuestionForm.querySelector("#title").value;
    const answerElms = addQuestionForm.querySelectorAll(".form-gr");
    const options = Array.from(answerElms).map((it) => {
      return {
        text: it.querySelector(".answer").value,
        isCorrect: it.querySelector('[name="answer"]').checked,
      };
    });

    try {
      const payload = {
        questions: [
          {
            title,
            options,
          },
        ],
      };

      await request({
        url: `/question/addquestions/${test}/${user._id}`,
        method: "POST",
        body: JSON.stringify(payload),
      });
      alert("Thêm câu hỏi thành công");
      window.location.href = `ds-cau-hoi.html?test=${test}`;
    } catch (error) {
      alert("Không thể thêm câu hỏi");
    }
  });
}

// update question
const updateQuestionForm = document.querySelector(".update-question-form");

const renderFormData = async () => {
  try {
    const res = await request({
      url: `/question/getDetailQuestionById/${test}/${id}`,
    });

    updateQuestionForm.querySelector("#title").value = res.title;
    const answerElms = updateQuestionForm.querySelectorAll(".form-gr");
    answerElms.forEach((it, index) => {
      it.querySelector(".answer").value = res.options[index].text;

      it.querySelector("[name='answer']").checked =
        res.options[index].isCorrect;
    });
  } catch (error) {
    console.log("Failed");
  }
};

if (updateQuestionForm) {
  // fill data to form
  renderFormData();

  updateQuestionForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = updateQuestionForm.querySelector("#title").value;
    const answerElms = updateQuestionForm.querySelectorAll(".form-gr");
    const options = Array.from(answerElms).map((it) => {
      return {
        text: it.querySelector(".answer").value,
        isCorrect: it.querySelector('[name="answer"]').checked,
      };
    });

    try {
      const payload = {
        title,
        options,
      };

      await request({
        url: `/question/updatequestion/${test}/${id}`,
        method: "PUT",
        body: JSON.stringify(payload),
      });

      alert("Cập nhật câu hỏi thành công");
      window.location.href = `ds-cau-hoi.html?test=${test}`;
    } catch (error) {
      alert("Không thể cập nhật câu hỏi");
    }
  });
}

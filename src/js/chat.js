import { request } from "../utils/request.js";
import { USER_INFO_STORAGE_KEY } from "../constants/constants.js";

const user = JSON.parse(localStorage.getItem(USER_INFO_STORAGE_KEY));
let currentSenderId;

const chatBox = document.querySelector(".chat-input");

// render chat user
const renderChatUsers = async (callback) => {
  try {
    const chatUserElm = document.querySelector(".list-group");

    const users = await request({
      url: `/message/getConversationsForTeacher/${user._id}`,
    });

    const htmlStr = users
      .map(
        (it, idx) => `<div
        class="list-group-item cursor-pointer chat-item list-group-item-action ${
          idx === 0 && "active"
        }" data-senderId=${it._id}
        >${it.name}</div
      >`
      )
      .join("");

    chatUserElm.innerHTML = htmlStr;
    currentSenderId = users[0]._id;

    callback(currentSenderId);

    // change chat user
    const chatUserElms = document.querySelectorAll(".list-group-item");
    chatUserElms.forEach((elm) => {
      elm.addEventListener("click", () => {
        const currentChatUserActive =
          document.querySelector(".chat-item.active");
        currentChatUserActive.classList.remove("active");

        renderChatContent(elm.dataset.senderid);
        elm.classList.add("active");
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const renderChatContent = async (senderId) => {
  try {
    const chatContainer = document.querySelector(".chat-messages");

    const r = await request({
      url: `/message/getMessages/${senderId}/${user._id}`,
    });

    const htmlStr = r.messages
      .map(
        (it) => `<div class="message ${it.senderId === senderId && "sender"}">
        <p>
          ${it.content}
        </p>
      </div>`
      )
      .join("");

    chatContainer.innerHTML = htmlStr;
    chatBox.classList.remove("d-none");
    chatContainer.scrollTo({
      top: chatContainer.scrollHeight,
    });
  } catch (error) {
    console.log(error);
  }
};

renderChatUsers(renderChatContent);

// send message
chatBox.addEventListener("keyup", async (e) => {
  const chatUserActive = document.querySelector(".chat-item.active");
  const currentSenderId = chatUserActive.dataset.senderid;

  const value = e.target.value;

  if (e.key === "Enter") {
    if (!value.trim().length) {
      alert("Vui lòng nhập tin nhắn");
    } else {
      await request({
        url: `/message/addMessage/${user._id}/${currentSenderId}`,
        method: "POST",
        body: JSON.stringify({
          content: value,
        }),
      });

      chatBox.querySelector("input").value = "";

      renderChatContent(currentSenderId);
    }
  }
});

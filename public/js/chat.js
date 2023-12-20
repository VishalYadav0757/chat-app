const socket = io();

// Elements \\
const messageForm = document.querySelector("#message-form");
const messageFormInput = messageForm.querySelector("input");
const messageFormButton = messageForm.querySelector("button");
const locationButton = document.querySelector("#send-location");
const messages = document.querySelector("#messages");
const sidebar = document.querySelector("#sidebar");

// Templates \\
const messageTemplate = document.querySelector("#message-template").innerHTML;
const locationTemplate = document.querySelector("#location-template").innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// Options \\
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Auto Scroll the screen when the new text comes \\
const autoScroll = () => {
  // New message element \\
  const newMessage = messages.lastElementChild;

  // Height of the new message \\
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = (newMessage.offsetHeight = newMessageMargin);

  // Visible height of the UI \\
  const visibleHeight = messages.offsetHeight;

  // Height of messages container \\
  const containerHeight = messages.scrollHeight;

  // How far is scrolled \\
  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight >= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
};

// Socket event to render messages \\
socket.on("message", (message) => {
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    message: message.text,
    createdAt: moment(message.createdAt).format("hh:mm a"),
  });

  messages.insertAdjacentHTML("beforeend", html);

  autoScroll();
});

// Socket event to render location \\
socket.on("locationMessage", (message) => {
  const html = Mustache.render(locationTemplate, {
    username: message.username,
    url: message.url,
    createdAt: moment(message.createdAt).format("hh:mm a"),
  });

  messages.insertAdjacentHTML("beforeend", html);

  autoScroll();
});

// Socket event to render all users in a room \\
socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });

  sidebar.innerHTML = html;
});

// Socket event to send messages \\
messageForm.addEventListener("submit", (e) => {
  e.preventDefault();

  messageFormButton.setAttribute("disabled", "disabled");

  const message = e.target.elements.message.value;

  socket.emit("sendMessage", message, (error) => {
    messageFormButton.removeAttribute("disabled");
    messageFormInput.value = "";
    messageFormInput.focus();

    if (error) {
      return alert(error);
    }
  });
});

// Socket event to send location \\
locationButton.addEventListener("click", () => {
  if (!navigator.geolocation) {
    return alert("Geolocation is not supported by your browser !!");
  }

  locationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition((position) => {
    const coords = position.coords;

    socket.emit(
      "sendLocation",
      {
        latitude: coords?.latitude,
        longitude: coords?.longitude,
      },
      () => {
        locationButton.removeAttribute("disabled");
      }
    );
  });
});

// Socket event to send options for the room \\
socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

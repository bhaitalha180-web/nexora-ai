const form = document.querySelector("#chatForm");
const input = document.querySelector("#prompt");
const messages = document.querySelector("#messages");
const sendBtn = document.querySelector("#sendBtn");

function addMessage(role, text) {
  const item = document.createElement("div");
  item.className = `msg ${role}`;

  const label = document.createElement("b");
  label.textContent = role === "user" ? "YOU" : "NEXORA AI";

  const body = document.createElement("p");
  body.textContent = text;

  item.append(label, body);
  messages.appendChild(item);
  messages.scrollTop = messages.scrollHeight;

  return body;
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const message = input.value.trim();
  if (!message) return;

  addMessage("user", message);
  input.value = "";
  sendBtn.disabled = true;

  const answer = addMessage("assistant", "Soch raha hoon...");

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.detail || data.error || `Error ${response.status}`
      );
    }

    answer.textContent =
      data.reply || "Jawab nahi mila. Dobara koshish karein.";

  } catch (error) {
    answer.textContent = "Asal error: " + error.message;
  } finally {
    sendBtn.disabled = false;
    input.focus();
    messages.scrollTop = messages.scrollHeight;
  }
});

document.querySelector("#clearBtn").addEventListener("click", () => {
  messages.replaceChildren();
  addMessage("assistant", "Chat clear ho gayi. Naya sawal poochhein!");
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

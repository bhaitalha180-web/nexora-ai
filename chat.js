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

  const answer = addMessage("assistant", "Connecting to NEXORA AI...");

  try {
    const response = await fetch("/.netlify/functions/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const raw = await response.text();

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      throw new Error("Server returned invalid response: " + raw.slice(0, 300));
    }

    if (!response.ok) {
      throw new Error(data.detail || data.error || "HTTP " + response.status);
    }

    answer.textContent = data.reply || data.text || "AI ka jawab nahi mila.";

  } catch (error) {
    answer.textContent = "ASAL ERROR: " + error.message;
  } finally {
    sendBtn.disabled = false;
    messages.scrollTop = messages.scrollHeight;
  }
});

document.querySelector("#clearBtn")?.addEventListener("click", () => {
  messages.replaceChildren();
  addMessage("assistant", "Chat clear ho gayi. Naya sawal poochhein!");
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

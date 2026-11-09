const form = document.querySelector("#book-form");
const status = document.querySelector("#status");

function messageFrom(form) {
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const people = String(data.get("people") || "").trim();
  const date = String(data.get("date") || "").trim();
  const kind = String(data.get("kind") || "").trim();
  const note = String(data.get("note") || "").trim();
  return [
    "Yard Vibes table request",
    "",
    `Name: ${name}`,
    `People: ${people}`,
    `Date: ${date}`,
    `For: ${kind}`,
    `Note: ${note || "—"}`,
  ].join("\n");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = messageFrom(form);
  try {
    await navigator.clipboard.writeText(text);
    status.textContent = "Copied. Open Instagram and paste it to @yardvibesdxb.";
  } catch {
    status.textContent = text;
  }
});

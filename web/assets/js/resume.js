async function getTokenData() {
  const res = await fetch("/api/resume?action=generate");

  try {
    const json = await res.json();
    if (!res.ok) {
      alert("Failed to get token! Error: " + (json.error ?? "unknown error"));
      return null;
    }

    return json;
  } catch (err) {
    alert("Failed to get token! See console for more info");
    console.log(err);
    return null;
  }
}

/**
 * @param {string} token
 */
async function getResumeData(token) {
  const res = await fetch("/api/resume?action=get&token=" + token);

  try {
    const json = await res.json();
    if (!res.ok) {
      // alert("Failed to get resume! Error: " + (json.error ?? "unknown error"));
      return null;
    }

    return json.file;
  } catch (err) {
    alert("Failed to get resume! See console for more info");
    console.log(err);
    return null;
  }
}

/**
 * @type {HTMLSpanElement}
 */
const statusText = document.getElementById("status-text");
/**
 * @type {HTMLDivElement}
 */
const viewer = document.getElementById("viewer");

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const token = params.get("token");
  if (token == null) {
    const data = await getTokenData();
    if (!data) return;

    const { token, delay } = data;
    if (token != null) {
      let timeRemaining = delay;
      statusText.textContent = `Redirecting in ${timeRemaining} seconds...`;

      let interval = setInterval(() => {
        timeRemaining--;
        if (timeRemaining < 0) {
          clearInterval(interval);
          return;
        }
        statusText.textContent = `Redirecting in ${timeRemaining} seconds...`;
      }, 1000);

      setTimeout(async () => {
        location.search = "token=" + token;
      }, delay * 1000 + 500);
    }
  } else {
    statusText.textContent = `Downloading pdf...`;
    const data = await getResumeData(token);
    console.log('data:',data)
    if (!data) {
      location.search = "";
      return;
    }

    let bstr = atob(data);
    const bytes = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) {
      bytes[i] = bstr.charCodeAt(i);
    }

    let blob = new Blob([bytes], { type: "application/pdf" });
    document.querySelector(".content").remove();

    [...document.body.children].map((c) => c.remove());
    document.body.style.overflow = "hidden";
    const url = URL.createObjectURL(blob);

    const iframe = document.createElement("iframe");
    iframe.src = url;

    document.body.appendChild(iframe);
  }
});

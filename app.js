// Replace with your actual Pexels API key string
const PEXELS_API_KEY = "srv-d4ojoh2dbo4c73f55vbg";

const resultsEl = document.getElementById("results");

// Utility: show loading spinner
function showLoading(message = "Loading...") {
  resultsEl.innerHTML = `
    <div class="loading">
      <i class="fas fa-spinner fa-spin"></i> ${message}
    </div>
  `;
}

// Utility: fetch videos from Pexels
async function fetchVideos(query, limit = 5) {
  try {
    const res = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${limit}`,
      { headers: { Authorization: PEXELS_API_KEY } }
    );

    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();
    return data.videos || [];
  } catch (err) {
    console.error("Fetch error:", err);
    return [];
  }
}

// Utility: render videos into #results
function renderVideos(videos, captionText, voiceoverText) {
  if (!videos.length) {
    resultsEl.innerHTML = `<p>No videos found. Try another search.</p>`;
    return;
  }

  const html = videos.map(v => {
    const file =
      v.video_files.find(f => f.quality === "sd" && f.width <= 400) ||
      v.video_files[0];

    const thumb = v.image || "https://via.placeholder.com/380x200?text=No+Thumbnail";

    return `
      <div class="video-block">
        <img src="${thumb}" alt="Thumbnail" class="video-thumb" onclick="playVideo('${file.link}')"/>
        <div class="video-meta">
          <h4>${captionText}</h4>
          <p><strong>Voiceover:</strong> ${voiceoverText}</p>
          <button onclick="playVoiceover('${voiceoverText}')">
            <i class="fas fa-volume-up"></i> Play Voiceover
          </button>
        </div>
      </div>
    `;
  }).join("");

  resultsEl.innerHTML = html;
}

// Play video dynamically
function playVideo(src) {
  resultsEl.innerHTML = `
    <video width="100%" controls autoplay>
      <source src="${src}" type="video/mp4">
      Your browser does not support the video tag.
    </video>
  `;
}

// Simulate voiceover with browser TTS
function playVoiceover(text) {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    speechSynthesis.speak(utterance);
  } else {
    alert("Voiceover not supported in this browser.");
  }
}

// Handle text prompt form
document.getElementById("searchForm").onsubmit = async function (e) {
  e.preventDefault();
  const prompt = document.getElementById("prompt").value.trim();
  if (!prompt) return;

  showLoading(`Searching videos for: "${prompt}"`);
  const videos = await fetchVideos(prompt, 5);
  renderVideos(videos, `"${prompt}"`, `"${prompt}"`);
};

// Handle URL form
document.getElementById("urlForm").onsubmit = async function (e) {
  e.preventDefault();
  const url = document.getElementById("videoUrl").value.trim();
  if (!url) return;

  // Extract a keyword from the URL (fallback: "nature")
  let query = "nature";
  try {
    const parts = url.split("/");
    const lastPart = parts[parts.length - 1];
    query = lastPart.replace(/[-_]/g, " ").split(".")[0] || "nature";
  } catch {
    query = "nature";
  }

  showLoading(`Creating clips for URL: ${url}`);
  const videos = await fetchVideos(query, 3);
  renderVideos(videos, "Auto-caption from URL", `Auto-voiceover for "${query}"`);
};

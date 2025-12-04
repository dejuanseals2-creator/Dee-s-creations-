const PEXELS_API_KEY = srv-d4ojoh2dbo4c73f55vbg

document.getElementById('searchForm').onsubmit = async function(e) {
  e.preventDefault();
  const prompt = document.getElementById('prompt').value;
  document.getElementById('results').innerHTML = 'Searching videos for: ' + prompt + '...';
  const res = await fetch('https://api.pexels.com/videos/search?query=' + encodeURIComponent(prompt), {
    headers: { Authorization: PEXELS_API_KEY }
  });
  const data = await res.json();
  if(data.videos && data.videos.length > 0) {
    let html = data.videos.slice(0,5).map(v => {
      const file = v.video_files.find(f => f.quality === 'sd' && f.width <= 400) || v.video_files[0];
      return `<div class="video-block">
        <video width="380" controls src="${file.link}"></video>
        <caption>Caption: "${prompt}"</caption>
        <span class="voiceover">Voiceover: "${prompt}"</span>
      </div>`;
    }).join('');
    document.getElementById('results').innerHTML = html;
  } else {
    document.getElementById('results').innerHTML = 'No videos found for your prompt.';
  }
};

// Simulate clip creation from URL (just search Pexels for a theme, real version would parse URL)
document.getElementById('urlForm').onsubmit = async function(e) {
  e.preventDefault();
  const url = document.getElementById('videoUrl').value;
  let query = url.split("/").pop().replace(/[-_]/g," ").split(".")[0] || "nature";
  document.getElementById('results').innerHTML = `Creating clips for URL: ${url}...`;
  const res = await fetch('https://api.pexels.com/videos/search?query=' + encodeURIComponent(query), {
    headers: { Authorization: PEXELS_API_KEY }
  });
  const data = await res.json();
  if(data.videos && data.videos.length > 0) {
    let html = data.videos.slice(0,3).map(v => {
      const file = v.video_files[0];
      return `<div class="video-block">
        <video width="380" controls src="${file.link}"></video>
        <caption>Auto-caption from URL</caption>
        <span class="voiceover">Auto-voiceover for "${query}"</span>
      </div>`;
    }).join('');
    document.getElementById('results').innerHTML = html;
  } else {
    document.getElementById('results').innerHTML = 'No clips found for your pasted URL.';
  }
};

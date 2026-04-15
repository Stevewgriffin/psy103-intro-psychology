import { icon } from '../icons.js';

export function renderAudioPlayer(weekId) {
  const container = document.getElementById('audio-player-area');
  if (!container) return;

  const audioPath = `audio/week${weekId}-overview.mp3`;

  container.innerHTML = `
    <div class="audio-widget" id="audio-widget">
      <img src="assets/professor-griffin.png" alt="Professor Griffin" style="width:48px;height:48px;border-radius:50%;object-fit:cover;flex-shrink:0;border:2px solid var(--accent);">
      <button class="audio-play-btn" id="audio-play">${icon('play', 18)}</button>
      <div class="audio-controls">
        <div class="audio-title">Prof. Griffin — Week ${weekId} Overview</div>
        <input type="range" class="audio-seek" id="audio-seek" min="0" max="100" value="0">
        <div class="audio-time">
          <span id="audio-current">0:00</span>
          <div style="display:flex;gap:8px;align-items:center;">
            <button class="audio-speed" id="audio-speed">1x</button>
            <span id="audio-duration">0:00</span>
          </div>
        </div>
      </div>
    </div>
    <audio id="audio-element" src="${audioPath}" preload="metadata"></audio>
  `;

  const audio = document.getElementById('audio-element');
  const playBtn = document.getElementById('audio-play');
  const seekBar = document.getElementById('audio-seek');
  const currentEl = document.getElementById('audio-current');
  const durationEl = document.getElementById('audio-duration');
  const speedBtn = document.getElementById('audio-speed');

  const speeds = [0.75, 1, 1.25, 1.5, 2];
  let speedIdx = 1;

  // Handle audio not found
  audio.addEventListener('error', () => {
    container.innerHTML = `
      <div class="audio-unavailable">
        ${icon('audio', 20)} Audio overview for Week ${weekId} will be available soon.
      </div>
    `;
  });

  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
    seekBar.max = Math.floor(audio.duration);
  });

  audio.addEventListener('timeupdate', () => {
    seekBar.value = Math.floor(audio.currentTime);
    currentEl.textContent = formatTime(audio.currentTime);
  });

  playBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play();
      playBtn.innerHTML = icon('pause', 18);
    } else {
      audio.pause();
      playBtn.innerHTML = icon('play', 18);
    }
  });

  seekBar.addEventListener('input', () => {
    audio.currentTime = seekBar.value;
  });

  speedBtn.addEventListener('click', () => {
    speedIdx = (speedIdx + 1) % speeds.length;
    audio.playbackRate = speeds[speedIdx];
    speedBtn.textContent = speeds[speedIdx] + 'x';
  });

  audio.addEventListener('ended', () => {
    playBtn.innerHTML = icon('play', 18);
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

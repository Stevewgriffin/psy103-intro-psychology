import { icon } from '../icons.js';

export async function renderSlideViewer(weekId, container) {
  if (!container) return;

  const audioDir = `pptx/slide-audio`;
  let slidesData = [];

  try {
    const mod = await import(`../../data/slides/week${weekId}-slides.js`);
    slidesData = mod.default;
  } catch (e) {
    container.innerHTML = '';
    return;
  }

  if (!slidesData.length) return;

  const totalSlides = slidesData.length;
  let current = 0;

  function getSlideAudio(idx) {
    if (idx === 0) return null;
    return `${audioDir}/w${weekId}-slide${idx + 1}.mp3`;
  }

  function renderSlideContent(slide) {
    if (slide.dark) {
      return `
        <div class="html-slide dark-slide">
          <div class="slide-title-text">${slide.title}</div>
          <ul class="slide-bullets">
            ${slide.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
        </div>
      `;
    }
    return `
      <div class="html-slide light-slide">
        <div class="slide-title-text">${slide.title}</div>
        <div class="slide-accent-bar"></div>
        <ul class="slide-bullets">
          ${slide.bullets.map(b => `<li>${b}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  function render() {
    const slide = slidesData[current];
    const audioSrc = getSlideAudio(current);
    const hasAudio = audioSrc !== null;

    container.innerHTML = `
      <div class="slide-viewer-wrapper">
        <div class="slide-viewer-header">
          <div style="display:flex;align-items:center;gap:10px;">
            <img src="assets/professor-griffin.png" alt="Prof. Griffin"
              style="width:36px;height:36px;border-radius:50%;object-fit:cover;border:2px solid var(--accent);">
            <div>
              <div style="font-weight:600;font-size:0.95rem;">Week ${weekId} Slide Review</div>
              <div style="font-size:0.8rem;color:var(--text-secondary);">Prof. Griffin — Narrated Presentation</div>
            </div>
          </div>
          <div class="slide-counter">${current + 1} / ${totalSlides}</div>
        </div>
        <div class="slide-content-area">
          ${renderSlideContent(slide)}
          <button class="slide-nav-btn slide-prev ${current === 0 ? 'disabled' : ''}" id="slide-prev">${icon('arrow_left', 24)}</button>
          <button class="slide-nav-btn slide-next ${current === totalSlides - 1 ? 'disabled' : ''}" id="slide-next">${icon('arrow_right', 24)}</button>
        </div>
        <div class="slide-audio-bar">
          ${hasAudio ? `
            <button class="audio-play-btn" id="slide-play" style="width:36px;height:36px;">${icon('play', 16)}</button>
            <input type="range" class="audio-seek" id="slide-seek" min="0" max="100" value="0" style="flex:1;">
            <span id="slide-time" style="font-family:var(--mono);font-size:0.75rem;color:var(--text-secondary);min-width:40px;">0:00</span>
            <button class="audio-speed" id="slide-speed" style="font-size:0.7rem;">1x</button>
          ` : `
            <div style="flex:1;text-align:center;color:var(--text-secondary);font-size:0.85rem;">
              ${current === 0 ? 'Title slide — advance to start narration' : 'No narration for this slide'}
            </div>
          `}
        </div>
      </div>
      ${hasAudio ? `<audio id="slide-audio" src="${audioSrc}" preload="metadata"></audio>` : ''}
    `;

    // Navigation
    document.getElementById('slide-prev')?.addEventListener('click', () => {
      if (current > 0) { current--; render(); }
    });
    document.getElementById('slide-next')?.addEventListener('click', () => {
      if (current < totalSlides - 1) { current++; render(); autoPlay(); }
    });

    // Keyboard
    const keyHandler = (e) => {
      if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
      if (e.key === 'ArrowRight' && current < totalSlides - 1) { current++; render(); autoPlay(); }
      if (e.key === 'ArrowLeft' && current > 0) { current--; render(); }
    };
    document.removeEventListener('keydown', container._keyHandler);
    container._keyHandler = keyHandler;
    document.addEventListener('keydown', keyHandler);

    // Audio
    if (hasAudio) {
      const audioEl = document.getElementById('slide-audio');
      const playBtn = document.getElementById('slide-play');
      const seekBar = document.getElementById('slide-seek');
      const timeEl = document.getElementById('slide-time');
      const speedBtn = document.getElementById('slide-speed');

      const speeds = [0.75, 1, 1.25, 1.5, 2];
      let speedIdx = 1;

      audioEl.addEventListener('loadedmetadata', () => {
        seekBar.max = Math.floor(audioEl.duration);
        timeEl.textContent = formatTime(audioEl.duration);
      });
      audioEl.addEventListener('timeupdate', () => {
        seekBar.value = Math.floor(audioEl.currentTime);
        timeEl.textContent = formatTime(audioEl.duration - audioEl.currentTime);
      });
      playBtn.addEventListener('click', () => {
        if (audioEl.paused) { audioEl.play(); playBtn.innerHTML = icon('pause', 16); }
        else { audioEl.pause(); playBtn.innerHTML = icon('play', 16); }
      });
      seekBar.addEventListener('input', () => { audioEl.currentTime = seekBar.value; });
      speedBtn.addEventListener('click', () => {
        speedIdx = (speedIdx + 1) % speeds.length;
        audioEl.playbackRate = speeds[speedIdx];
        speedBtn.textContent = speeds[speedIdx] + 'x';
      });
      audioEl.addEventListener('ended', () => {
        playBtn.innerHTML = icon('play', 16);
        if (current < totalSlides - 1) {
          setTimeout(() => { current++; render(); autoPlay(); }, 1500);
        }
      });
      audioEl.addEventListener('error', () => {
        const bar = document.querySelector('.slide-audio-bar');
        if (bar) bar.innerHTML = '<div style="flex:1;text-align:center;color:var(--text-secondary);font-size:0.85rem;">Audio loading...</div>';
      });
    }
  }

  function autoPlay() {
    setTimeout(() => {
      const a = document.getElementById('slide-audio');
      const btn = document.getElementById('slide-play');
      if (a) {
        a.play().then(() => { if (btn) btn.innerHTML = icon('pause', 16); }).catch(() => {});
      }
    }, 300);
  }

  render();
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

import { Store } from '../store.js';
import { icon } from '../icons.js';

export async function renderFormationReading(params) {
  const weekId = parseInt(params.id);
  const content = document.getElementById('content');
  const student = Store.getCurrentStudent();

  content.innerHTML = `<div class="text-center mt-3"><p>Loading reading...</p></div>`;

  try {
    const mod = await import(`../../data/formation/week${weekId}-reading.js`);
    const reading = mod.default;

    const sectionsHtml = reading.sections.map((s, i) => {
      if (!s.heading && !s.content) return '';
      const isChapterHeading = s.heading.startsWith('CHAPTER') || s.heading.startsWith('PART') || s.heading.startsWith('INTRODUCTION') || s.heading.startsWith('AFTERWORD');
      return `
        <div class="formation-section" id="fsection-${i}">
          ${s.heading ? `<h${isChapterHeading ? '2' : '3'} class="formation-heading ${isChapterHeading ? 'formation-chapter-heading' : ''}">${s.heading}</h${isChapterHeading ? '2' : '3'}>` : ''}
          <div class="formation-body">${s.content}</div>
        </div>
      `;
    }).join('');

    content.innerHTML = `
      <div class="formation-reading-page">
        <div class="formation-header">
          <div class="formation-book-label">COMPASS INSTITUTE</div>
          <div class="formation-book-title">The Architecture of Coherent Accounting</div>
          <div class="formation-book-subtitle">Why Formation Determines Whether Financial Truth Holds</div>
          <div class="formation-book-author">Steve W. Griffin</div>
        </div>

        <div class="formation-week-banner">
          <div class="formation-week-label">Week ${weekId} Reading</div>
          <h1 class="formation-week-title">${reading.title}</h1>
          <div class="formation-week-subtitle">${reading.subtitle}</div>
          <p class="formation-week-desc">${reading.description}</p>
        </div>

        <div class="formation-content">
          ${sectionsHtml}
        </div>

        <div class="mark-complete-bar">
          <button id="mark-reading-btn" class="btn ${Store.isFormationComplete(student, weekId) ? 'btn-secondary' : 'btn-success'} btn-lg">
            ${Store.isFormationComplete(student, weekId) ? icon('checkCircle') + ' Reading Complete' : icon('check') + ' Mark Reading as Complete'}
          </button>
        </div>

        <div class="mt-3">
          <a href="#/week/${weekId}" class="btn btn-secondary">${icon('arrow_left')} Back to Week ${weekId}</a>
        </div>
      </div>
    `;

    document.getElementById('mark-reading-btn')?.addEventListener('click', () => {
      Store.setFormationComplete(student, weekId);
      renderFormationReading(params);
    });

    document.getElementById('topbar').innerHTML = `
      <div class="topbar-breadcrumb">
        <a href="#/dashboard" style="color:var(--text-secondary)">${icon('home', 14)} Dashboard</a>
        &rsaquo; <a href="#/week/${weekId}" style="color:var(--text-secondary)">Week ${weekId}</a>
        &rsaquo; <span>Formation Reading</span>
      </div>
      <div class="topbar-right">${student}</div>
    `;

  } catch (e) {
    content.innerHTML = `
      <div class="card text-center mt-3">
        <h2>Week ${weekId} Formation Reading</h2>
        <p class="text-secondary mt-2">Loading...</p>
        <p class="text-secondary" style="font-size:0.8rem;">${e.message}</p>
        <a href="#/week/${weekId}" class="btn btn-primary mt-2">Back to Week ${weekId}</a>
      </div>
    `;
  }
}

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

    let sectionsHtml = '';
    if (reading.sections) {
      sectionsHtml = reading.sections.map((s, i) => {
        if (!s.heading && !s.content) return '';
        const isChapterHeading = s.heading && (s.heading.startsWith('CHAPTER') || s.heading.startsWith('PART') || s.heading.startsWith('INTRODUCTION') || s.heading.startsWith('AFTERWORD'));
        return `
          <div class="formation-section" id="fsection-${i}">
            ${s.heading ? `<h${isChapterHeading ? '2' : '3'} class="formation-heading ${isChapterHeading ? 'formation-chapter-heading' : ''}">${s.heading}</h${isChapterHeading ? '2' : '3'}>` : ''}
            <div class="formation-body">${s.content}</div>
          </div>
        `;
      }).join('');
    } else if (reading.content) {
      sectionsHtml = `<div class="formation-section"><div class="formation-body">${reading.content}</div></div>`;
    }

    content.innerHTML = `
      <div class="formation-reading-page">
        <div class="formation-header">
          <div class="formation-book-label">COMPASS INSTITUTE</div>
          <div class="formation-book-title">Moral Gravity</div>
          <div class="formation-book-subtitle">The Universal Forces That Have Shaped Human Character for 5,000 Years</div>
          <div class="formation-book-author">Steve W. Griffin</div>
        </div>

        <div class="formation-week-banner">
          <div class="formation-week-label">Week ${weekId} Reading</div>
          <h1 class="formation-week-title">${reading.title}</h1>
          ${reading.subtitle ? `<div class="formation-week-subtitle">${reading.subtitle}</div>` : ''}
          ${reading.description ? `<p class="formation-week-desc">${reading.description}</p>` : ''}
        </div>

        <!-- Full Book Link -->
        <a href="Moral-Gravity.pdf" target="_blank" class="openstax-read-btn">
          <div class="openstax-read-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div class="openstax-read-info">
            <div class="openstax-read-title">Read Full Book — Moral Gravity</div>
            <div class="openstax-read-desc">Complete book by Steve W. Griffin &middot; Opens in new tab</div>
          </div>
          <div class="openstax-read-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </a>

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

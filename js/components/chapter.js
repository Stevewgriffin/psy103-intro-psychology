import course from '../../data/course.js';
import { Store } from '../store.js';
import { icon } from '../icons.js';

export async function renderChapter(params) {
  const chNum = parseInt(params.id);
  const content = document.getElementById('content');
  const student = Store.getCurrentStudent();

  content.innerHTML = `<div class="text-center mt-3"><p>Loading chapter ${chNum}...</p></div>`;

  try {
    const mod = await import(`../../data/chapters/ch${String(chNum).padStart(2, '0')}.js`);
    const chapter = mod.default;
    const isDone = Store.isChapterComplete(student, chNum);

    const prevCh = chNum > 1 ? chNum - 1 : null;
    const nextCh = chNum < 16 ? chNum + 1 : null;
    const week = course.weeks.find(w => w.chapters.includes(chNum));
    const weekId = week ? week.id : null;

    // Build section content
    const sectionContent = chapter.sections.map((s, i) => `
      <div id="section-${i}">
        <h2>${s.title}</h2>
        ${s.content}
      </div>
    `).join('');

    // Key terms
    const keyTerms = [...new Set(chapter.sections.flatMap(s => s.keyTerms || []))];
    const keyTermsHtml = keyTerms.length > 0 ? `
      <div class="card mb-3" style="background:var(--accent-light);">
        <div class="card-header" style="color:var(--accent);">Key Terms</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;">
          ${keyTerms.map(t => `<span class="key-term">${t}</span>`).join('')}
        </div>
      </div>
    ` : '';

    // OpenStax URL
    const openstaxUrl = chapter.openstaxUrl || `https://openstax.org/books/principles-financial-accounting/pages/${chNum}-why-it-matters`;

    content.innerHTML = `
      <div class="chapter-viewer">
        <div class="chapter-header-block">
          <h1>Chapter ${chNum}: ${chapter.title}</h1>
          <div class="chapter-meta">
            ${weekId ? `<a href="#/week/${weekId}">Week ${weekId}: ${week.title}</a> &middot; ` : ''}
            ${chapter.sections.length} sections
            ${isDone ? ` &middot; <span class="text-success">${icon('checkCircle', 14)} Complete</span>` : ''}
          </div>
        </div>

        <!-- Full Textbook Link -->
        <a href="${openstaxUrl}" target="_blank" class="openstax-read-btn">
          <div class="openstax-read-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="24" height="24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          </div>
          <div class="openstax-read-info">
            <div class="openstax-read-title">Read Full Chapter on OpenStax</div>
            <div class="openstax-read-desc">Complete textbook with images, diagrams, and examples &middot; Opens in new tab</div>
          </div>
          <div class="openstax-read-arrow">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
        </a>
        <p style="font-size:0.75rem;color:var(--text-secondary);margin-top:4px;">Textbook: <em>Psychology 2e</em> by OpenStax, licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank">CC BY 4.0</a></p>

        ${keyTermsHtml}

        <div class="chapter-content">
          ${sectionContent}
        </div>

        ${chapter.summary ? `
          <div class="card mt-3" style="background:#f7fafc;">
            <div class="card-header">Chapter Summary</div>
            ${chapter.summary}
          </div>
        ` : ''}

        <div class="mark-complete-bar">
          <button id="mark-complete-btn" class="btn ${isDone ? 'btn-secondary' : 'btn-success'} btn-lg">
            ${isDone ? icon('checkCircle') + ' Completed' : icon('check') + ' Mark as Complete'}
          </button>
        </div>

        <div class="chapter-nav">
          ${prevCh ? `<a href="#/chapter/${prevCh}" class="btn btn-secondary">${icon('arrow_left')} Chapter ${prevCh}</a>` : '<span></span>'}
          ${nextCh ? `<a href="#/chapter/${nextCh}" class="btn btn-secondary">Chapter ${nextCh} ${icon('arrow_right')}</a>` : '<span></span>'}
        </div>
      </div>
    `;

    // Mark complete handler
    document.getElementById('mark-complete-btn').addEventListener('click', () => {
      Store.setChapterComplete(student, chNum);
      renderChapter(params);
    });

    // Topbar
    document.getElementById('topbar').innerHTML = `
      <div class="topbar-breadcrumb">
        <a href="#/dashboard" style="color:var(--text-secondary)">${icon('home', 14)} Dashboard</a>
        ${weekId ? ` &rsaquo; <a href="#/week/${weekId}" style="color:var(--text-secondary)">Week ${weekId}</a>` : ''}
        &rsaquo; <span>Chapter ${chNum}</span>
      </div>
      <div class="topbar-right">${student}</div>
    `;

  } catch (e) {
    content.innerHTML = `
      <div class="card text-center mt-3">
        <h2>Chapter ${chNum}</h2>
        <p class="text-secondary mt-2">Chapter content is loading...</p>
        <p class="text-secondary" style="font-size:0.8rem;">Error: ${e.message}</p>
        <a href="#/dashboard" class="btn btn-primary mt-2">Back to Dashboard</a>
      </div>
    `;
  }
}

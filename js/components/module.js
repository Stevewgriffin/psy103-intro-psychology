import course from '../../data/course.js';
import slos from '../../data/slos.js';
import { Store } from '../store.js';
import { icon } from '../icons.js';

export function renderModule(params) {
  const weekId = parseInt(params.id);
  const week = course.weeks.find(w => w.id === weekId);
  if (!week) return;

  const content = document.getElementById('content');
  const student = Store.getCurrentStudent();
  const weekSlos = slos[weekId] || [];

  // Chapter list
  const chapterList = week.chapters.map(c => {
    const done = Store.isChapterComplete(student, c);
    return `
      <li class="chapter-item" onclick="location.hash='#/chapter/${c}'">
        <div class="ch-status ${done ? 'done' : ''}">${done ? icon('check', 14) : ''}</div>
        <div class="ch-info">
          <div class="ch-title">Chapter ${c}: ${course.chapterTitles[c]}</div>
          <div class="ch-desc">${done ? 'Completed' : 'Click to read'}</div>
        </div>
      </li>
    `;
  }).join('');

  // Quiz status
  const quiz = Store.getQuizScore(student, weekId);
  const quizStatus = quiz
    ? `<span class="badge badge-success">${quiz.percentage}%</span>`
    : `<span class="badge badge-warning">Not taken</span>`;

  // Practice status
  const practiceCompleted = Store.getPracticeCompleted(student, weekId);
  const practiceStatus = practiceCompleted.length > 0
    ? `<span class="badge badge-success">${practiceCompleted.length} completed</span>`
    : `<span class="badge badge-warning">Not started</span>`;

  // Discussion status
  const posts = Store.getDiscussionPosts(weekId);
  const myPosts = posts.filter(p => p.author === student);
  const discStatus = myPosts.length > 0
    ? `<span class="badge badge-success">${myPosts.length} post(s)</span>`
    : `<span class="badge badge-warning">No posts yet</span>`;

  // Case study status
  const caseResponse = Store.getCaseResponse(student, weekId);
  const caseStatus = caseResponse?.submitted
    ? `<span class="badge badge-success">${icon('check', 12)} Submitted</span>`
    : caseResponse?.responses
      ? `<span class="badge badge-warning">Draft saved</span>`
      : `<span class="badge badge-warning">Not started</span>`;

  // SLO list
  const sloList = weekSlos.map(s => `
    <li class="slo-item">
      <div class="slo-check">${icon('target', 14)}</div>
      <span>${s.text}</span>
    </li>
  `).join('');

  content.innerHTML = `
    <h1 class="mb-1">Week ${weekId}: ${week.title}</h1>
    <p class="text-secondary mb-3">${week.topics.join(' &middot; ')}</p>

    <div id="audio-player-area" class="mb-3"></div>

    <div id="slide-viewer-area" class="mb-3"></div>

    <div class="card mb-3" style="background:#f0f7ff;border-left:4px solid var(--accent);">
      <div class="card-header" style="color:var(--accent);">${icon('target')} Learning Outcomes for This Week</div>
      <ul class="slo-list">
        ${sloList}
      </ul>
    </div>

    <div class="card mb-3">
      <div class="card-header">${icon('book')} Textbook Chapters</div>
      <p class="text-secondary" style="font-size:0.85rem;margin-bottom:12px;">Read each chapter and mark it complete when you are done.</p>
      <ul class="chapter-list">
        ${chapterList}
      </ul>
    </div>

    <div class="activity-item mb-3" onclick="location.hash='#/formation/${weekId}'" style="cursor:pointer;">
      <div class="activity-icon" style="background:#f5f0ff;color:#6b21a8;">${icon('book', 20)}</div>
      <div class="activity-info">
        <div class="activity-title">Formation Reading: <em>Moral Gravity</em></div>
        <div class="activity-desc">Compass Institute — Prof. Griffin's companion text on character formation</div>
      </div>
      <div class="activity-status">
        ${Store.isFormationComplete(student, weekId)
          ? `<span class="badge badge-success">${icon('check', 12)} Read</span>`
          : `<span class="badge badge-warning">Not read</span>`}
      </div>
    </div>

    <h2 class="mb-2">Activities</h2>
    <ul class="activity-list">
      <li class="activity-item" onclick="location.hash='#/quiz/${weekId}'">
        <div class="activity-icon quiz">${icon('quiz', 20)}</div>
        <div class="activity-info">
          <div class="activity-title">Week ${weekId} Quiz</div>
          <div class="activity-desc">Multiple choice &middot; 15-20 questions</div>
        </div>
        <div class="activity-status">${quizStatus}</div>
      </li>
      <li class="activity-item" onclick="location.hash='#/practice/${weekId}'">
        <div class="activity-icon practice">${icon('pencil', 20)}</div>
        <div class="activity-info">
          <div class="activity-title">Practice Problems</div>
          <div class="activity-desc">Worked examples with step-by-step solutions</div>
        </div>
        <div class="activity-status">${practiceStatus}</div>
      </li>
      <li class="activity-item" onclick="location.hash='#/discussion/${weekId}'">
        <div class="activity-icon discussion">${icon('chat', 20)}</div>
        <div class="activity-info">
          <div class="activity-title">Discussion Board</div>
          <div class="activity-desc">Post your response and reply to your classmate</div>
        </div>
        <div class="activity-status">${discStatus}</div>
      </li>
      <li class="activity-item" onclick="location.hash='#/case/${weekId}'">
        <div class="activity-icon" style="background:#fdf2f8;color:#b83280;">${icon('book', 20)}</div>
        <div class="activity-info">
          <div class="activity-title">Case Study</div>
          <div class="activity-desc">Compass Institute case &middot; Written analysis required</div>
        </div>
        <div class="activity-status">${caseStatus}</div>
      </li>
    </ul>
  `;

  // Load audio player
  import('./audio-player.js').then(mod => {
    mod.renderAudioPlayer(weekId);
  });

  // Load slide viewer (only for weeks with slide images)
  import('./slide-viewer.js').then(mod => {
    const slideArea = document.getElementById('slide-viewer-area');
    if (slideArea) {
      mod.renderSlideViewer(weekId, slideArea);
    }
  });

  document.getElementById('topbar').innerHTML = `
    <div class="topbar-breadcrumb">
      <a href="#/dashboard" style="color:var(--text-secondary)">${icon('home', 14)} Dashboard</a> &rsaquo; <span>Week ${weekId}</span>
    </div>
    <div class="topbar-right">${student}</div>
  `;
}

import course from '../../data/course.js';
import { Store } from '../store.js';
import { icon } from '../icons.js';

export function renderDashboard() {
  const content = document.getElementById('content');
  const student = Store.getCurrentStudent();
  const progress = Store.getProgress(student);
  const firstName = student.split(' ')[0];

  const weekCards = course.weeks.map(w => {
    const chapDone = w.chapters.filter(c => Store.isChapterComplete(student, c)).length;
    const chapTotal = w.chapters.length;
    const quiz = Store.getQuizScore(student, w.id);
    const pct = Math.round((chapDone / chapTotal) * 100);

    let status = 'pending';
    let statusBadge = `<span class="badge badge-warning">In Progress</span>`;
    if (chapDone === chapTotal && quiz) {
      status = 'completed';
      statusBadge = `<span class="badge badge-success">${icon('check', 12)} Complete</span>`;
    }

    return `
      <div class="module-card ${status === 'completed' ? 'completed' : 'current'}" onclick="location.hash='#/week/${w.id}'">
        <div class="flex justify-between items-center">
          <div class="module-title">Week ${w.id}: ${w.title}</div>
          ${statusBadge}
        </div>
        <div class="module-meta">${w.topics.join(' &middot; ')}</div>
        <div class="module-progress mt-1">
          <div class="flex justify-between" style="font-size:0.8rem;color:var(--text-secondary);margin-bottom:4px;">
            <span>Chapters: ${chapDone}/${chapTotal}</span>
            <span>Quiz: ${quiz ? quiz.percentage + '%' : 'Not taken'}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-bar-fill ${pct === 100 ? 'green' : 'blue'}" style="width:${pct}%"></div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  content.innerHTML = `
    <div class="welcome-banner">
      <h1>Welcome back, ${firstName}</h1>
      <p>${course.code} &mdash; ${course.title} &middot; ${course.term}</p>
    </div>

    <div class="stat-cards">
      <div class="stat-card">
        <div class="stat-value" style="color:var(--accent)">${progress.chaptersCompleted}/${progress.totalChapters}</div>
        <div class="stat-label">Chapters Read</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:var(--success)">${progress.quizzesTaken}/5</div>
        <div class="stat-label">Quizzes Taken</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:${progress.quizAverage >= 70 ? 'var(--success)' : 'var(--warning)'}">${progress.quizAverage}%</div>
        <div class="stat-label">Quiz Average</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" style="color:var(--primary)">${progress.finalExam ? progress.finalExam.percentage + '%' : '--'}</div>
        <div class="stat-label">Final Exam</div>
      </div>
    </div>

    <h2 class="mb-2">Weekly Modules</h2>
    <div class="flex flex-col gap-2">
      ${weekCards}
    </div>
  `;

  // Update topbar
  document.getElementById('topbar').innerHTML = `
    <div class="topbar-breadcrumb">${icon('home', 14)} <span>Dashboard</span></div>
    <div class="topbar-right">${student}</div>
  `;
}

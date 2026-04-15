import course from '../../data/course.js';
import slos from '../../data/slos.js';
import { Store } from '../store.js';
import { icon } from '../icons.js';

export function renderProgress() {
  const content = document.getElementById('content');
  const student = Store.getCurrentStudent();
  const progress = Store.getProgress(student);

  // Calculate weighted grade
  let quizWeighted = 0;
  let quizCount = 0;
  for (let w = 1; w <= 5; w++) {
    const q = Store.getQuizScore(student, w);
    if (q) { quizWeighted += q.percentage; quizCount++; }
  }
  const quizAvg = quizCount > 0 ? Math.round(quizWeighted / quizCount) : 0;

  // Case study grades
  let caseTotal = 0;
  let caseCount = 0;
  for (let w = 1; w <= 5; w++) {
    const grade = Store.getCaseGrade(student, w);
    if (grade?.overall) {
      caseTotal += grade.overall.score;
      caseCount++;
    }
  }
  const casePct = caseCount > 0 ? Math.round(caseTotal / caseCount) : 0;

  // Discussion participation
  let totalPosts = 0;
  for (let w = 1; w <= 5; w++) {
    const posts = Store.getDiscussionPosts(w).filter(p => p.author === student);
    totalPosts += posts.length;
  }
  const discPct = Math.min(100, Math.round((totalPosts / 5) * 100));

  const finalExam = progress.finalExam;
  const finalPct = finalExam ? finalExam.percentage : 0;

  // Weighted total
  const g = course.grading;
  const overallGrade =
    (quizAvg * g.quizzes.weight / 100) +
    (casePct * g.cases.weight / 100) +
    (discPct * g.discussion.weight / 100) +
    (finalPct * g.final.weight / 100);
  const roundedGrade = Math.round(overallGrade);

  function letterGrade(pct) {
    if (pct >= 90) return 'A';
    if (pct >= 80) return 'B';
    if (pct >= 70) return 'C';
    if (pct >= 60) return 'D';
    return 'F';
  }

  // Weekly detail rows
  const weekRows = course.weeks.map(w => {
    const chapDone = w.chapters.filter(c => Store.isChapterComplete(student, c)).length;
    const quiz = Store.getQuizScore(student, w.id);
    const caseGrade = Store.getCaseGrade(student, w.id);
    const myPosts = Store.getDiscussionPosts(w.id).filter(p => p.author === student).length;

    return `
      <tr>
        <td><a href="#/week/${w.id}">Week ${w.id}</a></td>
        <td>${chapDone}/${w.chapters.length}</td>
        <td>${quiz ? `<span class="${quiz.percentage >= 70 ? 'text-success' : 'text-danger'}">${quiz.percentage}%</span>` : '--'}</td>
        <td>${caseGrade?.overall ? `<span class="${caseGrade.overall.score >= 70 ? 'text-success' : 'text-danger'}">${caseGrade.overall.score}%</span>` : '--'}</td>
        <td>${myPosts}</td>
      </tr>
    `;
  }).join('');

  // SLO checklist
  const sloChecklist = Object.entries(slos).map(([weekId, items]) => {
    const weekNum = parseInt(weekId);
    const quiz = Store.getQuizScore(student, weekNum);
    const chapsDone = course.weeks[weekNum - 1].chapters.every(c => Store.isChapterComplete(student, c));
    const met = quiz && quiz.percentage >= 70 && chapsDone;

    return `
      <div class="mb-2">
        <h4>Week ${weekId}</h4>
        <ul class="slo-list">
          ${items.map(s => `
            <li class="slo-item">
              <div class="slo-check ${met ? 'met' : ''}">${met ? icon('check', 12) : ''}</div>
              <span>${s.text}</span>
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }).join('');

  content.innerHTML = `
    <h1 class="mb-3">Grades &amp; Progress</h1>

    <div class="card mb-3">
      <div class="grade-summary">
        <div class="grade-circle" style="border:4px solid ${roundedGrade >= 70 ? 'var(--success)' : 'var(--warning)'}">
          <div class="grade-value">${roundedGrade}%</div>
          <div class="grade-label">${letterGrade(roundedGrade)}</div>
        </div>
        <div class="grade-breakdown">
          <div class="grade-row">
            <span class="label">Quizzes (${g.quizzes.weight}%)</span>
            <span class="bar-wrap"><div class="progress-bar"><div class="progress-bar-fill blue" style="width:${quizAvg}%"></div></div></span>
            <span class="value">${quizAvg}%</span>
          </div>
          <div class="grade-row">
            <span class="label">Cases (${g.cases.weight}%)</span>
            <span class="bar-wrap"><div class="progress-bar"><div class="progress-bar-fill green" style="width:${casePct}%"></div></div></span>
            <span class="value">${casePct}%</span>
          </div>
          <div class="grade-row">
            <span class="label">Discussion (${g.discussion.weight}%)</span>
            <span class="bar-wrap"><div class="progress-bar"><div class="progress-bar-fill green" style="width:${discPct}%"></div></div></span>
            <span class="value">${discPct}%</span>
          </div>
          <div class="grade-row">
            <span class="label">Final Exam (${g.final.weight}%)</span>
            <span class="bar-wrap"><div class="progress-bar"><div class="progress-bar-fill ${finalPct >= 70 ? 'green' : 'yellow'}" style="width:${finalPct}%"></div></div></span>
            <span class="value">${finalExam ? finalPct + '%' : '--'}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">Weekly Breakdown</div>
      <table class="syllabus-table">
        <thead>
          <tr><th>Week</th><th>Chapters</th><th>Quiz</th><th>Case Study</th><th>Posts</th></tr>
        </thead>
        <tbody>${weekRows}</tbody>
      </table>
    </div>

    <div class="card">
      <div class="card-header">${icon('target')} Student Learning Outcomes</div>
      <p class="text-secondary" style="font-size:0.85rem;margin-bottom:16px;">SLOs are marked as met when you complete all chapters and score 70%+ on the quiz for that week.</p>
      ${sloChecklist}
    </div>
  `;

  document.getElementById('topbar').innerHTML = `
    <div class="topbar-breadcrumb">${icon('chart', 14)} <span>Grades &amp; Progress</span></div>
    <div class="topbar-right">${student}</div>
  `;
}

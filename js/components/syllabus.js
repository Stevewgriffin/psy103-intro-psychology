import course from '../../data/course.js';
import slos from '../../data/slos.js';
import { icon } from '../icons.js';
import { Store } from '../store.js';

export function renderSyllabus() {
  const content = document.getElementById('content');
  const student = Store.getCurrentStudent();

  const weekRows = course.weeks.map(w => {
    const chList = w.chapters.map(c => `Ch ${c}: ${course.chapterTitles[c]}`).join('<br>');
    return `
      <tr>
        <td><strong>Week ${w.id}</strong><br>${w.dateRange}</td>
        <td>${w.title}</td>
        <td>${chList}</td>
        <td>Quiz ${w.id}, Practice Problems, Discussion Post</td>
      </tr>
    `;
  }).join('');

  const sloSections = Object.entries(slos).map(([weekId, items]) => `
    <div class="mb-2">
      <h4>Week ${weekId}: ${course.weeks[weekId - 1].title}</h4>
      <ul class="slo-list">
        ${items.map(s => `
          <li class="slo-item">
            <div class="slo-check">${icon('target', 14)}</div>
            <span>${s.text}</span>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');

  content.innerHTML = `
    <h1 class="mb-1">Course Syllabus</h1>
    <p class="text-secondary mb-3">${course.code} &mdash; ${course.title} &middot; ${course.term}</p>

    <div class="card mb-3">
      <div class="card-header">Course Description</div>
      <p>This course introduces the principles of financial accounting. You will learn how businesses record, summarize, and report financial information. Topics include the accounting cycle, financial statements, internal controls, assets, liabilities, and equity. By the end of this course, you will be able to read and prepare basic financial statements.</p>
      <p>This is a 5-week accelerated course. Each week covers 3-4 chapters with a quiz, practice problems, and a discussion post. A comprehensive final exam is given at the end of Week 5.</p>
    </div>

    <div class="card mb-3">
      <div class="card-header">Weekly Schedule</div>
      <table class="syllabus-table">
        <thead>
          <tr>
            <th style="width:120px">Week</th>
            <th style="width:180px">Module</th>
            <th>Chapters</th>
            <th style="width:200px">Assignments</th>
          </tr>
        </thead>
        <tbody>
          ${weekRows}
          <tr>
            <td><strong>Final</strong></td>
            <td>Comprehensive Exam</td>
            <td>All chapters (1-16)</td>
            <td>Final Exam (50 questions)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card mb-3">
      <div class="card-header">Grading Policy</div>
      <table class="syllabus-table">
        <thead>
          <tr><th>Component</th><th>Weight</th></tr>
        </thead>
        <tbody>
          ${Object.values(course.grading).map(g => `
            <tr><td>${g.label}</td><td>${g.weight}%</td></tr>
          `).join('')}
          <tr style="font-weight:bold"><td>Total</td><td>100%</td></tr>
        </tbody>
      </table>
      <div class="mt-2" style="font-size:0.9rem;">
        <p><strong>Grading Scale:</strong> A = 90-100% | B = 80-89% | C = 70-79% | D = 60-69% | F = below 60%</p>
      </div>
    </div>

    <div class="card mb-3">
      <div class="card-header">Student Learning Outcomes (SLOs)</div>
      <p class="text-secondary" style="font-size:0.9rem;margin-bottom:16px;">These measurable outcomes define what you should be able to do after each week. Your quizzes and assignments are designed to assess these outcomes.</p>
      ${sloSections}
    </div>

    <div class="card mb-3">
      <div class="card-header">Course Materials</div>
      <p><strong>Required Textbook:</strong> <em>Principles of Accounting, Volume 1: Financial Accounting</em> by OpenStax (embedded in this course site).</p>
      <p>This is a free, open-source textbook licensed under CC BY 4.0. All chapter content is available within the course modules.</p>
    </div>

    <div class="card">
      <div class="card-header">Academic Integrity</div>
      <p>All work submitted must be your own. You may discuss concepts with your classmate, but all quiz answers and discussion posts must be written independently. If you are unsure about a question, ask your instructor for help.</p>
    </div>
  `;

  document.getElementById('topbar').innerHTML = `
    <div class="topbar-breadcrumb">${icon('calendar', 14)} <span>Syllabus</span></div>
    <div class="topbar-right">${student}</div>
  `;
}

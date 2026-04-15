import course from '../../data/course.js';
import { Store } from '../store.js';
import { icon } from '../icons.js';

export async function renderPractice(params) {
  const weekId = parseInt(params.id);
  const content = document.getElementById('content');
  const student = Store.getCurrentStudent();
  const week = course.weeks.find(w => w.id === weekId);

  content.innerHTML = `<div class="text-center mt-3"><p>Loading practice problems...</p></div>`;

  try {
    const mod = await import(`../../data/practice/week${weekId}-practice.js`);
    const practiceData = mod.default;
    const completed = Store.getPracticeCompleted(student, weekId);

    const problems = practiceData.problems.map((p, i) => {
      const isDone = completed.includes(p.id);
      return `
        <div class="practice-problem" id="practice-${p.id}">
          <div class="flex justify-between items-center">
            <div class="problem-title">${icon('pencil')} Problem ${i + 1}: ${p.title}</div>
            ${isDone ? `<span class="badge badge-success">${icon('check', 12)} Done</span>` : ''}
          </div>
          <div class="mt-1" style="line-height:1.7">${p.prompt}</div>
          ${p.hints && p.hints.length > 0 ? `
            <div class="mt-1">
              <button class="btn btn-sm btn-secondary hint-btn" data-id="${p.id}">
                ${icon('star', 14)} Show Hint
              </button>
              <div class="hint-box hidden" id="hint-${p.id}">${p.hints.join('<br><br>')}</div>
            </div>
          ` : ''}
          <div class="mt-1">
            <button class="btn btn-sm btn-primary solution-btn" data-id="${p.id}">
              ${icon('checkCircle', 14)} Show Solution
            </button>
            <div class="solution-box hidden" id="solution-${p.id}">${p.workedSolution}</div>
          </div>
          ${!isDone ? `
            <div class="mt-1">
              <button class="btn btn-sm btn-success mark-done-btn" data-id="${p.id}">
                ${icon('check', 14)} Mark as Reviewed
              </button>
            </div>
          ` : ''}
        </div>
      `;
    }).join('');

    content.innerHTML = `
      <h1 class="mb-1">${practiceData.title}</h1>
      <p class="text-secondary mb-3">Work through each problem. Use hints if you need help, then check the solution. Mark each problem as reviewed when you are done.</p>
      <div class="flex flex-col gap-2">
        ${problems}
      </div>
      <div class="mt-3">
        <a href="#/week/${weekId}" class="btn btn-secondary">${icon('arrow_left')} Back to Week ${weekId}</a>
      </div>
    `;

    // Hint toggles
    content.querySelectorAll('.hint-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const hintEl = document.getElementById(`hint-${btn.dataset.id}`);
        hintEl.classList.toggle('hidden');
        btn.textContent = hintEl.classList.contains('hidden') ? 'Show Hint' : 'Hide Hint';
      });
    });

    // Solution toggles
    content.querySelectorAll('.solution-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const solEl = document.getElementById(`solution-${btn.dataset.id}`);
        solEl.classList.toggle('hidden');
        btn.textContent = solEl.classList.contains('hidden') ? 'Show Solution' : 'Hide Solution';
      });
    });

    // Mark done
    content.querySelectorAll('.mark-done-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Store.markPracticeComplete(student, weekId, parseInt(btn.dataset.id));
        renderPractice(params);
      });
    });

  } catch (e) {
    content.innerHTML = `
      <div class="card text-center mt-3">
        <h2>Week ${weekId} Practice</h2>
        <p class="text-secondary mt-2">Practice problems are loading...</p>
        <a href="#/week/${weekId}" class="btn btn-primary mt-2">Back to Week ${weekId}</a>
      </div>
    `;
  }

  document.getElementById('topbar').innerHTML = `
    <div class="topbar-breadcrumb">
      <a href="#/dashboard" style="color:var(--text-secondary)">${icon('home', 14)} Dashboard</a>
      &rsaquo; <a href="#/week/${weekId}" style="color:var(--text-secondary)">Week ${weekId}</a>
      &rsaquo; <span>Practice</span>
    </div>
    <div class="topbar-right">${student}</div>
  `;
}

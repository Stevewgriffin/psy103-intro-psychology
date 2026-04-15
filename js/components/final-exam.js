import { Store } from '../store.js';
import { icon } from '../icons.js';

export async function renderFinalExam() {
  const content = document.getElementById('content');
  const student = Store.getCurrentStudent();

  const existing = Store.getFinalExamScore(student);

  content.innerHTML = `<div class="text-center mt-3"><p>Loading final exam...</p></div>`;

  try {
    const mod = await import('../../data/quizzes/final-exam.js');
    const examData = mod.default;

    if (existing) {
      renderFinalResults(content, examData, existing, student);
      return;
    }

    renderFinalQuestions(content, examData, student);
  } catch (e) {
    content.innerHTML = `
      <div class="card text-center mt-3">
        <h2>Final Exam</h2>
        <p class="text-secondary mt-2">The final exam is loading...</p>
        <a href="#/dashboard" class="btn btn-primary mt-2">Back to Dashboard</a>
      </div>
    `;
  }
}

function renderFinalQuestions(content, examData, student) {
  const answers = {};

  const questions = examData.questions.map((q, i) => {
    const optionsHtml = q.options.map((opt, j) => `
      <li class="option-item" data-q="${i}" data-opt="${j}">
        <div class="option-radio"></div>
        <span>${opt}</span>
      </li>
    `).join('');

    return `
      <div class="question-card" id="q-${i}">
        <div class="question-num">Question ${i + 1} of ${examData.questions.length}</div>
        <div class="question-text">${q.question}</div>
        <ul class="option-list">${optionsHtml}</ul>
      </div>
    `;
  }).join('');

  content.innerHTML = `
    <div class="card mb-3" style="background:#fff5f5;border-left:4px solid var(--danger);">
      <h1 style="color:var(--danger);">${icon('quiz')} Final Exam</h1>
      <p>This is the comprehensive final exam covering all 16 chapters. You have one attempt. Read each question carefully before answering.</p>
      <p><strong>${examData.questions.length} questions</strong> &middot; Covers Chapters 1-16</p>
    </div>

    <div class="quiz-header">
      <div class="quiz-progress">
        <span id="answered-count">0</span> / ${examData.questions.length} answered
      </div>
    </div>

    ${questions}

    <div class="text-center mt-3">
      <button id="submit-exam" class="btn btn-danger btn-lg" disabled>
        ${icon('check')} Submit Final Exam
      </button>
      <p class="text-secondary mt-1" style="font-size:0.8rem;">This cannot be undone. Make sure you have answered every question.</p>
    </div>
  `;

  // Option click handlers
  content.querySelectorAll('.option-item').forEach(el => {
    el.addEventListener('click', () => {
      const qIdx = el.dataset.q;
      const optIdx = parseInt(el.dataset.opt);
      el.closest('.option-list').querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      answers[qIdx] = optIdx;
      document.getElementById('answered-count').textContent = Object.keys(answers).length;
      document.getElementById('submit-exam').disabled = Object.keys(answers).length < examData.questions.length;
    });
  });

  document.getElementById('submit-exam').addEventListener('click', () => {
    if (Object.keys(answers).length < examData.questions.length) return;

    if (!confirm('Are you sure you want to submit the final exam? This cannot be undone.')) return;

    let score = 0;
    examData.questions.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });

    const result = {
      score,
      total: examData.questions.length,
      percentage: Math.round((score / examData.questions.length) * 100),
      answers: Object.entries(answers).map(([qi, ai]) => ({
        question: parseInt(qi),
        selected: ai,
        correct: examData.questions[parseInt(qi)].correct,
      })),
    };

    Store.saveFinalExamScore(student, result);
    renderFinalResults(content, examData, result, student);
  });

  document.getElementById('topbar').innerHTML = `
    <div class="topbar-breadcrumb">
      <a href="#/dashboard" style="color:var(--text-secondary)">${icon('home', 14)} Dashboard</a>
      &rsaquo; <span>Final Exam</span>
    </div>
    <div class="topbar-right">${student}</div>
  `;
}

function renderFinalResults(content, examData, result, student) {
  const passed = result.percentage >= 70;

  const reviewHtml = examData.questions.map((q, i) => {
    const selected = result.answers.find(a => a.question === i);
    const isCorrect = selected && selected.selected === q.correct;

    const optionsHtml = q.options.map((opt, j) => {
      let cls = '';
      if (j === q.correct) cls = 'correct';
      else if (selected && j === selected.selected && j !== q.correct) cls = 'incorrect';
      return `<li class="option-item ${cls}"><div class="option-radio"></div><span>${opt}</span></li>`;
    }).join('');

    return `
      <div class="question-card">
        <div class="question-num">
          Question ${i + 1}
          ${isCorrect
            ? `<span class="badge badge-success" style="margin-left:8px;">${icon('check', 12)} Correct</span>`
            : `<span class="badge badge-danger" style="margin-left:8px;">Incorrect</span>`
          }
        </div>
        <div class="question-text">${q.question}</div>
        <ul class="option-list">${optionsHtml}</ul>
        <div class="explanation-box">${q.explanation}</div>
      </div>
    `;
  }).join('');

  content.innerHTML = `
    <div class="card results-card mb-3">
      <h1>Final Exam Results</h1>
      <div class="results-score ${passed ? 'pass' : 'fail'}">${result.percentage}%</div>
      <p>${result.score} out of ${result.total} correct</p>
      <p class="badge ${passed ? 'badge-success' : 'badge-danger'}" style="font-size:0.9rem;padding:4px 16px;">
        ${passed ? 'PASSED' : 'NEEDS REVIEW'}
      </p>
      <div class="mt-2">
        <a href="#/grades" class="btn btn-primary">View Overall Grades</a>
        <a href="#/dashboard" class="btn btn-secondary" style="margin-left:8px;">Dashboard</a>
      </div>
    </div>
    <h2 class="mb-2">Review Your Answers</h2>
    ${reviewHtml}
  `;

  document.getElementById('topbar').innerHTML = `
    <div class="topbar-breadcrumb">
      <a href="#/dashboard" style="color:var(--text-secondary)">${icon('home', 14)} Dashboard</a>
      &rsaquo; <span>Final Exam Results</span>
    </div>
    <div class="topbar-right">${student}</div>
  `;
}

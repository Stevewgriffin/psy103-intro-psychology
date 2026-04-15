import course from '../../data/course.js';
import { Store } from '../store.js';
import { icon } from '../icons.js';

export async function renderQuiz(params) {
  const weekId = parseInt(params.id);
  const content = document.getElementById('content');
  const student = Store.getCurrentStudent();
  const week = course.weeks.find(w => w.id === weekId);

  // Check if already taken
  const existing = Store.getQuizScore(student, weekId);

  content.innerHTML = `<div class="text-center mt-3"><p>Loading quiz...</p></div>`;

  try {
    const mod = await import(`../../data/quizzes/week${weekId}-quiz.js`);
    const quizData = mod.default;

    if (existing) {
      renderResults(content, quizData, existing, weekId, student, week);
      return;
    }

    renderQuizQuestions(content, quizData, weekId, student, week);
  } catch (e) {
    content.innerHTML = `
      <div class="card text-center mt-3">
        <h2>Week ${weekId} Quiz</h2>
        <p class="text-secondary mt-2">Quiz is loading... If this persists, the quiz data may not be available yet.</p>
        <a href="#/week/${weekId}" class="btn btn-primary mt-2">Back to Week ${weekId}</a>
      </div>
    `;
  }
}

function renderQuizQuestions(content, quizData, weekId, student, week) {
  const answers = {};

  const questions = quizData.questions.map((q, i) => {
    const optionsHtml = q.options.map((opt, j) => `
      <li class="option-item" data-q="${i}" data-opt="${j}">
        <div class="option-radio"></div>
        <span>${opt}</span>
      </li>
    `).join('');

    return `
      <div class="question-card" id="q-${i}">
        <div class="question-num">Question ${i + 1} of ${quizData.questions.length}</div>
        <div class="question-text">${q.question}</div>
        <ul class="option-list">
          ${optionsHtml}
        </ul>
      </div>
    `;
  }).join('');

  content.innerHTML = `
    <div class="quiz-header">
      <div>
        <h1>${quizData.title}</h1>
        <p class="text-secondary" style="margin:0;">Answer all questions, then click Submit.</p>
      </div>
      <div class="quiz-progress">
        <span id="answered-count">0</span> / ${quizData.questions.length} answered
      </div>
    </div>
    ${questions}
    <div class="text-center mt-3">
      <button id="submit-quiz" class="btn btn-primary btn-lg" disabled>
        ${icon('check')} Submit Quiz
      </button>
      <p class="text-secondary mt-1" style="font-size:0.8rem;">You cannot change your answers after submitting.</p>
    </div>
  `;

  // Option click handlers
  content.querySelectorAll('.option-item').forEach(el => {
    el.addEventListener('click', () => {
      const qIdx = el.dataset.q;
      const optIdx = parseInt(el.dataset.opt);

      // Deselect siblings
      el.closest('.option-list').querySelectorAll('.option-item').forEach(o => o.classList.remove('selected'));
      el.classList.add('selected');
      answers[qIdx] = optIdx;

      // Update count
      document.getElementById('answered-count').textContent = Object.keys(answers).length;
      document.getElementById('submit-quiz').disabled = Object.keys(answers).length < quizData.questions.length;
    });
  });

  // Submit handler
  document.getElementById('submit-quiz').addEventListener('click', () => {
    if (Object.keys(answers).length < quizData.questions.length) return;

    let score = 0;
    quizData.questions.forEach((q, i) => {
      if (answers[i] === q.correct) score++;
    });

    const result = {
      score,
      total: quizData.questions.length,
      percentage: Math.round((score / quizData.questions.length) * 100),
      answers: Object.entries(answers).map(([qi, ai]) => ({
        question: parseInt(qi),
        selected: ai,
        correct: quizData.questions[parseInt(qi)].correct,
      })),
    };

    Store.saveQuizScore(student, weekId, result);
    renderResults(content, quizData, result, weekId, student, week);
  });

  // Topbar
  document.getElementById('topbar').innerHTML = `
    <div class="topbar-breadcrumb">
      <a href="#/dashboard" style="color:var(--text-secondary)">${icon('home', 14)} Dashboard</a>
      &rsaquo; <a href="#/week/${weekId}" style="color:var(--text-secondary)">Week ${weekId}</a>
      &rsaquo; <span>Quiz</span>
    </div>
    <div class="topbar-right">${student}</div>
  `;
}

function renderResults(content, quizData, result, weekId, student, week) {
  const passed = result.percentage >= 70;

  const reviewHtml = quizData.questions.map((q, i) => {
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
      <h1>Quiz Results</h1>
      <div class="results-score ${passed ? 'pass' : 'fail'}">${result.percentage}%</div>
      <p>${result.score} out of ${result.total} correct</p>
      <p class="badge ${passed ? 'badge-success' : 'badge-danger'}" style="font-size:0.9rem;padding:4px 16px;">
        ${passed ? 'PASSED' : 'NEEDS REVIEW'}
      </p>
      <div class="mt-2">
        <a href="#/week/${weekId}" class="btn btn-secondary">Back to Week ${weekId}</a>
      </div>
    </div>

    <h2 class="mb-2">Review Your Answers</h2>
    ${reviewHtml}
  `;

  document.getElementById('topbar').innerHTML = `
    <div class="topbar-breadcrumb">
      <a href="#/dashboard" style="color:var(--text-secondary)">${icon('home', 14)} Dashboard</a>
      &rsaquo; <a href="#/week/${weekId}" style="color:var(--text-secondary)">Week ${weekId}</a>
      &rsaquo; <span>Quiz Results</span>
    </div>
    <div class="topbar-right">${student}</div>
  `;
}

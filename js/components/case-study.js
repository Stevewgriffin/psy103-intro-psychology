import course from '../../data/course.js';
import { Store } from '../store.js';
import { icon } from '../icons.js';
import students from '../../data/students.js';

export async function renderCaseStudy(params) {
  const weekId = parseInt(params.id);
  const content = document.getElementById('content');
  const student = Store.getCurrentStudent();
  const week = course.weeks.find(w => w.id === weekId);
  const isAdmin = students.find(s => s.name === student)?.isAdmin;

  content.innerHTML = `<div class="text-center mt-3"><p>Loading case study...</p></div>`;

  try {
    const mod = await import(`../../data/cases/week${weekId}-case.js`);
    const caseData = mod.default;
    const saved = Store.getCaseResponse(student, weekId);

    // Build case document
    const sectionsHtml = caseData.sections.map(s => `
      <div class="case-section">
        <h3 class="case-section-heading">${s.heading}</h3>
        <div class="case-section-body">${s.content}</div>
      </div>
    `).join('');

    const exhibitsHtml = caseData.exhibits.map(e => `
      <div class="case-exhibit">
        <div class="case-exhibit-title">${e.title}</div>
        <div class="case-exhibit-content">${e.content}</div>
      </div>
    `).join('');

    const questionsHtml = caseData.questions.map(q => {
      const response = saved?.responses?.[q.id] || '';
      const isLocked = saved?.submitted;
      return `
        <div class="case-question" id="question-${q.id}">
          <div class="case-question-num">Question ${q.id}</div>
          <div class="case-question-prompt">${q.prompt}</div>
          <textarea
            class="case-response-input"
            id="response-${q.id}"
            placeholder="Type your response here..."
            rows="6"
            ${isLocked ? 'disabled' : ''}
          >${response}</textarea>
          <div class="case-word-count" id="wc-${q.id}">
            <span id="wc-num-${q.id}">${countWords(response)}</span> words
            ${q.wordMin ? `<span class="text-secondary">(minimum ${q.wordMin} words)</span>` : ''}
          </div>
        </div>
      `;
    }).join('');

    // Admin view: show all student submissions with AI grading
    let adminHtml = '';
    if (isAdmin) {
      const studentList = students.filter(s => !s.isAdmin);
      const submissions = studentList.map(s => {
        const sub = Store.getCaseResponse(s.name, weekId);
        const grades = Store.getCaseGrade(s.name, weekId);
        if (!sub || !sub.responses) {
          return `
            <div class="card mb-2" style="border-left:4px solid var(--warning);">
              <div class="flex justify-between items-center">
                <strong>${s.name}</strong>
                <span class="badge badge-warning">Not submitted</span>
              </div>
            </div>
          `;
        }
        const qResponses = caseData.questions.map(q => {
          const qGrade = grades?.questions?.[q.id];
          return `
            <div class="mb-2">
              <div class="flex justify-between items-center">
                <div style="font-weight:600;font-size:0.85rem;color:var(--accent);">Question ${q.id}</div>
                ${qGrade ? `<span class="badge ${qGrade.score >= 70 ? 'badge-success' : 'badge-danger'}">${qGrade.score}/100</span>` : ''}
              </div>
              <div style="font-size:0.9rem;white-space:pre-wrap;background:var(--bg);padding:8px 12px;border-radius:var(--radius-sm);margin-top:4px;">${sub.responses[q.id] || '<em>No response</em>'}</div>
              ${qGrade ? `<div style="font-size:0.8rem;color:var(--text-secondary);margin-top:6px;padding:6px 10px;background:#f0f7ff;border-radius:var(--radius-sm);border-left:3px solid var(--accent);"><strong>Feedback:</strong> ${qGrade.feedback}</div>` : ''}
            </div>
          `;
        }).join('');

        const overallGrade = grades?.overall;
        return `
          <div class="card mb-2" style="border-left:4px solid ${sub.submitted ? (overallGrade ? 'var(--accent)' : 'var(--success)') : 'var(--warning)'};">
            <div class="flex justify-between items-center mb-2">
              <strong>${s.name}</strong>
              <div class="flex gap-1 items-center">
                ${overallGrade ? `<span class="badge ${overallGrade.score >= 70 ? 'badge-success' : 'badge-danger'}" style="font-size:0.9rem;padding:4px 12px;">${overallGrade.score}/100</span>` : ''}
                <span class="badge ${sub.submitted ? 'badge-success' : 'badge-warning'}">
                  ${sub.submitted ? 'Submitted' : 'Draft'}
                </span>
              </div>
            </div>
            ${overallGrade ? `<div style="font-size:0.85rem;margin-bottom:12px;padding:8px 12px;background:#f0fff4;border-radius:var(--radius-sm);border-left:3px solid var(--success);"><strong>Overall:</strong> ${overallGrade.feedback}</div>` : ''}
            ${qResponses}
            ${sub.submitted && !overallGrade ? `
              <button class="btn btn-primary btn-sm mt-2 grade-ai-btn" data-student="${s.name}" data-week="${weekId}">
                ${icon('star', 14)} Grade with AI
              </button>
            ` : ''}
            ${sub.submitted && overallGrade ? `
              <button class="btn btn-secondary btn-sm mt-2 grade-ai-btn" data-student="${s.name}" data-week="${weekId}">
                ${icon('star', 14)} Re-grade with AI
              </button>
            ` : ''}
          </div>
        `;
      }).join('');

      adminHtml = `
        <div class="mt-3">
          <h2 class="mb-2">${icon('user')} Student Submissions</h2>
          ${submissions}
        </div>
      `;
    }

    content.innerHTML = `
      <div class="case-study-page">
        <!-- Case Document -->
        <div class="case-document">
          <div class="case-header">
            <div class="case-institution">COMPASS INSTITUTE</div>
            <div class="case-meta-row">
              <span class="case-number">${caseData.caseNumber}</span>
              <span class="case-date">${caseData.date}</span>
            </div>
          </div>
          <div class="case-title-block">
            <h1 class="case-title">${caseData.title}</h1>
            <div class="case-author">Prepared by ${caseData.author}</div>
          </div>
          <div class="case-body">
            ${sectionsHtml}
            ${exhibitsHtml ? `<div class="case-exhibits-section"><h3 class="case-section-heading">Exhibits</h3>${exhibitsHtml}</div>` : ''}
          </div>
          <div class="case-footer">
            <p>This case was prepared by ${caseData.author} at the Compass Institute as a basis for class discussion rather than to illustrate either effective or ineffective management. Financial data is sourced from publicly available filings.</p>
            <p>&copy; ${new Date().getFullYear()} Compass Institute. For use in ACCT 301 — Financial Accounting.</p>
          </div>
        </div>

        <!-- Response Form -->
        <div class="case-response-section mt-3">
          <div class="card">
            <div class="card-header">${icon('pencil')} Your Response</div>
            ${saved?.submitted ? `
              <div class="badge badge-success mb-2" style="padding:6px 12px;">
                ${icon('checkCircle', 14)} Submitted on ${new Date(saved.submittedDate).toLocaleDateString()}
              </div>
            ` : ''}
            ${questionsHtml}
            ${!saved?.submitted ? `
              <div class="flex gap-2 mt-2">
                <button id="save-draft-btn" class="btn btn-secondary">${icon('book')} Save Draft</button>
                <button id="submit-case-btn" class="btn btn-success">${icon('check')} Submit Response</button>
              </div>
              <p class="text-secondary mt-1" style="font-size:0.8rem;">Save Draft keeps your work without submitting. Submit locks your response.</p>
            ` : ''}
          </div>
        </div>

        ${adminHtml}

        <div class="mt-3">
          <a href="#/week/${weekId}" class="btn btn-secondary">${icon('arrow_left')} Back to Week ${weekId}</a>
        </div>
      </div>
    `;

    // Wire up word counts
    caseData.questions.forEach(q => {
      const textarea = document.getElementById(`response-${q.id}`);
      const wcNum = document.getElementById(`wc-num-${q.id}`);
      if (textarea && wcNum) {
        textarea.addEventListener('input', () => {
          const wc = countWords(textarea.value);
          wcNum.textContent = wc;
          wcNum.style.color = (q.wordMin && wc < q.wordMin) ? 'var(--danger)' : 'var(--success)';
        });
        // Trigger initial color
        const wc = countWords(textarea.value);
        wcNum.style.color = (q.wordMin && wc < q.wordMin) ? 'var(--danger)' : 'var(--success)';
      }
    });

    // Save draft
    document.getElementById('save-draft-btn')?.addEventListener('click', () => {
      const responses = {};
      caseData.questions.forEach(q => {
        responses[q.id] = document.getElementById(`response-${q.id}`)?.value || '';
      });
      Store.saveCaseResponse(student, weekId, { responses, submitted: false });
      alert('Draft saved!');
    });

    // Submit
    document.getElementById('submit-case-btn')?.addEventListener('click', () => {
      const responses = {};
      let allMet = true;
      caseData.questions.forEach(q => {
        const text = document.getElementById(`response-${q.id}`)?.value || '';
        responses[q.id] = text;
        if (q.wordMin && countWords(text) < q.wordMin) allMet = false;
      });

      if (!allMet) {
        alert('Please meet the minimum word count for all questions before submitting.');
        return;
      }
      if (!confirm('Are you sure? Once submitted, you cannot edit your response.')) return;

      Store.saveCaseResponse(student, weekId, {
        responses,
        submitted: true,
        submittedDate: new Date().toISOString(),
      });
      renderCaseStudy(params); // re-render locked
    });

    // AI Grading (admin only)
    content.querySelectorAll('.grade-ai-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const studentName = btn.dataset.student;
        const wk = parseInt(btn.dataset.week);
        const sub = Store.getCaseResponse(studentName, wk);
        if (!sub?.responses) return;

        btn.disabled = true;
        btn.innerHTML = `${icon('clock', 14)} Grading...`;

        try {
          const res = await fetch('/.netlify/functions/grade-case', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              caseTitle: caseData.title,
              caseNumber: caseData.caseNumber,
              questions: caseData.questions,
              responses: sub.responses,
              weekId: wk,
            }),
          });

          if (!res.ok) {
            const err = await res.json();
            alert('Grading error: ' + (err.error || 'Unknown error'));
            btn.disabled = false;
            btn.innerHTML = `${icon('star', 14)} Grade with AI`;
            return;
          }

          const grades = await res.json();
          Store.saveCaseGrade(studentName, wk, grades);
          renderCaseStudy(params); // re-render with grades
        } catch (e) {
          alert('Grading failed: ' + e.message);
          btn.disabled = false;
          btn.innerHTML = `${icon('star', 14)} Grade with AI`;
        }
      });
    });

    // Topbar
    document.getElementById('topbar').innerHTML = `
      <div class="topbar-breadcrumb">
        <a href="#/dashboard" style="color:var(--text-secondary)">${icon('home', 14)} Dashboard</a>
        &rsaquo; <a href="#/week/${weekId}" style="color:var(--text-secondary)">Week ${weekId}</a>
        &rsaquo; <span>Case Study</span>
      </div>
      <div class="topbar-right">${student}</div>
    `;

  } catch (e) {
    content.innerHTML = `
      <div class="card text-center mt-3">
        <h2>Week ${weekId} Case Study</h2>
        <p class="text-secondary mt-2">Case study is loading...</p>
        <p class="text-secondary" style="font-size:0.8rem;">Error: ${e.message}</p>
        <a href="#/week/${weekId}" class="btn btn-primary mt-2">Back to Week ${weekId}</a>
      </div>
    `;
  }
}

function countWords(text) {
  if (!text || !text.trim()) return 0;
  return text.trim().split(/\s+/).length;
}

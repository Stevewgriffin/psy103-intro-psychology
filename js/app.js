import { initRouter, addRoute, navigate, setBeforeEach } from './router.js';
import { Store } from './store.js';
import { renderLogin } from './components/login.js';
import { renderSidebar, highlightActive } from './components/sidebar.js';
import { renderDashboard } from './components/dashboard.js';
import { renderSyllabus } from './components/syllabus.js';
import { renderModule } from './components/module.js';
import { renderChapter } from './components/chapter.js';
import { renderQuiz } from './components/quiz.js';
import { renderPractice } from './components/practice.js';
import { renderDiscussion } from './components/discussion.js';
import { renderProgress } from './components/progress.js';
import { renderFinalExam } from './components/final-exam.js';
import { renderCaseStudy } from './components/case-study.js';
import { renderFormationReading } from './components/formation-reading.js';
import { icon } from './icons.js';

// Auth guard
setBeforeEach((path) => {
  if (path === '/login') return true;
  const student = Store.getCurrentStudent();
  if (!student) {
    navigate('/login');
    return false;
  }
  return true;
});

// Register routes
addRoute('/login', () => renderLogin());

addRoute('/dashboard', () => {
  renderSidebar();
  renderDashboard();
  highlightActive();
});

addRoute('/syllabus', () => {
  renderSidebar();
  renderSyllabus();
  highlightActive();
});

addRoute('/week/:id', (params) => {
  renderSidebar();
  renderModule(params);
  highlightActive();
});

addRoute('/chapter/:id', (params) => {
  renderSidebar();
  renderChapter(params);
  highlightActive();
});

addRoute('/quiz/:id', (params) => {
  renderSidebar();
  renderQuiz(params);
  highlightActive();
});

addRoute('/practice/:id', (params) => {
  renderSidebar();
  renderPractice(params);
  highlightActive();
});

addRoute('/discussion/:id', (params) => {
  renderSidebar();
  renderDiscussion(params);
  highlightActive();
});

addRoute('/formation/:id', (params) => {
  renderSidebar();
  renderFormationReading(params);
  highlightActive();
});

addRoute('/case/:id', (params) => {
  renderSidebar();
  renderCaseStudy(params);
  highlightActive();
});

addRoute('/grades', () => {
  renderSidebar();
  renderProgress();
  highlightActive();
});

addRoute('/final-exam', () => {
  renderSidebar();
  renderFinalExam();
  highlightActive();
});

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  // Add mobile menu button
  const toggleBtn = document.createElement('button');
  toggleBtn.className = 'menu-toggle';
  toggleBtn.innerHTML = icon('menu', 20);
  toggleBtn.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
  });
  document.body.appendChild(toggleBtn);

  // Close sidebar on content click (mobile)
  document.getElementById('content')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.remove('open');
  });
});

// Initialize
initRouter();

import course from '../../data/course.js';
import { Store } from '../store.js';
import { navigate, getCurrentRoute } from '../router.js';
import { icon } from '../icons.js';

export function renderSidebar() {
  const sidebar = document.getElementById('sidebar');
  const student = Store.getCurrentStudent();

  const weekLinks = course.weeks.map(w => `
    <a class="nav-item nav-sub-item" href="#/week/${w.id}" data-route="/week/${w.id}">
      ${icon('book')} Week ${w.id}: ${w.title}
    </a>
  `).join('');

  sidebar.innerHTML = `
    <div class="sidebar-header">
      <h2>${course.code}</h2>
      <div class="course-code">${course.title} &middot; ${course.term}</div>
    </div>
    <nav class="sidebar-nav">
      <a class="nav-item" href="#/dashboard" data-route="/dashboard">
        ${icon('home')} Dashboard
      </a>
      <a class="nav-item" href="#/syllabus" data-route="/syllabus">
        ${icon('calendar')} Syllabus
      </a>
      <div class="nav-divider"></div>
      <div class="nav-section-label">Modules</div>
      ${weekLinks}
      <div class="nav-divider"></div>
      <a class="nav-item" href="#/final-exam" data-route="/final-exam">
        ${icon('quiz')} Final Exam
      </a>
      <a class="nav-item" href="#/grades" data-route="/grades">
        ${icon('chart')} Grades &amp; Progress
      </a>
    </nav>
    <div class="sidebar-footer">
      <div class="student-name">${icon('user')} ${student || 'Guest'}</div>
      <a href="#" id="logout-link" style="color:rgba(255,255,255,0.5);font-size:0.75rem;display:flex;align-items:center;gap:4px;margin-top:8px;text-decoration:none;">
        ${icon('logout', 14)} Sign Out
      </a>
    </div>
  `;

  // Active state
  highlightActive();

  // Click handlers for nav items (prevent default, use router)
  sidebar.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', (e) => {
      // Close mobile sidebar
      sidebar.classList.remove('open');
    });
  });

  // Logout
  document.getElementById('logout-link').addEventListener('click', (e) => {
    e.preventDefault();
    Store.logout();
    navigate('/login');
  });
}

export function highlightActive() {
  const current = getCurrentRoute();
  document.querySelectorAll('#sidebar .nav-item').forEach(el => {
    const route = el.getAttribute('data-route');
    if (route && current && current.startsWith(route)) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

import students from '../../data/students.js';
import course from '../../data/course.js';
import { Store } from '../store.js';
import { navigate } from '../router.js';

export function renderLogin() {
  const loginScreen = document.getElementById('login-screen');
  const appShell = document.getElementById('app-shell');

  // Check if already logged in
  const current = Store.getCurrentStudent();
  if (current) {
    loginScreen.classList.add('hidden');
    appShell.classList.remove('hidden');
    navigate('/dashboard');
    return;
  }

  loginScreen.classList.remove('hidden');
  appShell.classList.add('hidden');

  const options = students.map(s =>
    `<option value="${s.name}">${s.name}</option>`
  ).join('');

  loginScreen.innerHTML = `
    <div class="login-box">
      <div class="login-logo">&#x1F9E0;</div>
      <h1>${course.code}</h1>
      <p class="subtitle">${course.title}</p>
      <div class="form-group">
        <label for="student-select">Select Your Name</label>
        <select id="student-select">
          <option value="">-- Choose your name --</option>
          ${options}
        </select>
      </div>
      <button id="login-btn" class="btn btn-primary btn-lg" disabled>Enter Course</button>
      <p style="margin-top:16px;font-size:0.8rem;color:var(--text-secondary)">${course.term}</p>
    </div>
  `;

  const select = document.getElementById('student-select');
  const btn = document.getElementById('login-btn');

  select.addEventListener('change', () => {
    btn.disabled = !select.value;
  });

  btn.addEventListener('click', () => {
    if (select.value) {
      Store.setCurrentStudent(select.value);
      loginScreen.classList.add('hidden');
      appShell.classList.remove('hidden');
      navigate('/dashboard');
    }
  });
}

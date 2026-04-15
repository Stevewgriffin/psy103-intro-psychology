import { Store } from '../store.js';
import { icon } from '../icons.js';

export async function renderDiscussion(params) {
  const weekId = parseInt(params.id);
  const content = document.getElementById('content');
  const student = Store.getCurrentStudent();

  try {
    const mod = await import(`../../data/discussions/week${weekId}-prompts.js`);
    const promptData = mod.default;
    const posts = Store.getDiscussionPosts(weekId);

    const promptsHtml = promptData.prompts.map(p => `
      <div class="discussion-prompt">
        <h3>${p.title}</h3>
        <p style="margin:0;">${p.text}</p>
        <p style="font-size:0.8rem;color:var(--text-secondary);margin:8px 0 0;">Post at least ${p.minPosts} response(s) and ${p.minReplies} reply to a classmate.</p>
      </div>
    `).join('');

    const postsHtml = posts.length > 0 ? posts.map(p => {
      const initials = p.author.split(' ').map(w => w[0]).join('');
      const date = new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });

      const repliesHtml = (p.replies || []).map(r => {
        const rInitials = r.author.split(' ').map(w => w[0]).join('');
        const rDate = new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
        return `
          <div class="post-item" style="padding:8px 0;">
            <div class="post-header">
              <div class="post-avatar" style="width:24px;height:24px;font-size:0.65rem;">${rInitials}</div>
              <span class="post-author" style="font-size:0.85rem;">${r.author}</span>
              <span class="post-date">${rDate}</span>
            </div>
            <div class="post-body">${escapeHtml(r.text)}</div>
          </div>
        `;
      }).join('');

      return `
        <div class="post-item">
          <div class="post-header">
            <div class="post-avatar">${initials}</div>
            <div>
              <div class="post-author">${p.author}</div>
              <div class="post-date">${date}</div>
            </div>
          </div>
          <div class="post-body">${escapeHtml(p.text)}</div>
          ${repliesHtml ? `<div class="post-replies">${repliesHtml}</div>` : ''}
          <div class="reply-form mt-1">
            <button class="reply-btn" data-postid="${p.id}">Reply</button>
            <div class="hidden" id="reply-form-${p.id}">
              <textarea id="reply-text-${p.id}" placeholder="Write your reply..." rows="2" style="margin-top:6px;"></textarea>
              <button class="btn btn-sm btn-primary mt-1 submit-reply-btn" data-postid="${p.id}">Post Reply</button>
            </div>
          </div>
        </div>
      `;
    }).join('') : '<p class="text-secondary text-center mt-2">No posts yet. Be the first to start the discussion!</p>';

    content.innerHTML = `
      <h1 class="mb-1">Week ${weekId} Discussion</h1>
      <p class="text-secondary mb-3">Read the prompt below, then share your thoughts. Reply to your classmate's post.</p>

      ${promptsHtml}

      <div class="card mb-3">
        <div class="card-header">New Post</div>
        <div class="post-form">
          <textarea id="new-post-text" placeholder="Write your response to the discussion prompt..." rows="4"></textarea>
          <button id="submit-post" class="btn btn-primary mt-1">${icon('chat')} Post Response</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">Discussion (${posts.length} post${posts.length !== 1 ? 's' : ''})</div>
        <ul class="post-list">
          ${postsHtml}
        </ul>
      </div>

      <div class="mt-3">
        <a href="#/week/${weekId}" class="btn btn-secondary">${icon('arrow_left')} Back to Week ${weekId}</a>
      </div>
    `;

    // Submit new post
    document.getElementById('submit-post').addEventListener('click', () => {
      const text = document.getElementById('new-post-text').value.trim();
      if (!text) return;
      Store.addDiscussionPost(weekId, { author: student, text });
      renderDiscussion(params);
    });

    // Reply toggles
    content.querySelectorAll('.reply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const form = document.getElementById(`reply-form-${btn.dataset.postid}`);
        form.classList.toggle('hidden');
      });
    });

    // Submit reply
    content.querySelectorAll('.submit-reply-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const text = document.getElementById(`reply-text-${btn.dataset.postid}`).value.trim();
        if (!text) return;
        Store.addReply(weekId, parseInt(btn.dataset.postid), { author: student, text });
        renderDiscussion(params);
      });
    });

  } catch (e) {
    content.innerHTML = `
      <div class="card text-center mt-3">
        <h2>Week ${weekId} Discussion</h2>
        <p class="text-secondary mt-2">Discussion prompts are loading...</p>
        <a href="#/week/${weekId}" class="btn btn-primary mt-2">Back to Week ${weekId}</a>
      </div>
    `;
  }

  document.getElementById('topbar').innerHTML = `
    <div class="topbar-breadcrumb">
      <a href="#/dashboard" style="color:var(--text-secondary)">${icon('home', 14)} Dashboard</a>
      &rsaquo; <a href="#/week/${weekId}" style="color:var(--text-secondary)">Week ${weekId}</a>
      &rsaquo; <span>Discussion</span>
    </div>
    <div class="topbar-right">${student}</div>
  `;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML.replace(/\n/g, '<br>');
}

// localStorage wrapper for student data
const PREFIX = 'psy103';

function key(...parts) {
  return `${PREFIX}-${parts.join('-')}`;
}

export const Store = {
  // Current student
  getCurrentStudent() {
    return localStorage.getItem(key('currentStudent'));
  },
  setCurrentStudent(name) {
    localStorage.setItem(key('currentStudent'), name);
  },
  logout() {
    localStorage.removeItem(key('currentStudent'));
  },

  // Chapter completion
  isChapterComplete(studentName, chapterNum) {
    return localStorage.getItem(key(studentName, 'chapter', chapterNum, 'complete')) === 'true';
  },
  setChapterComplete(studentName, chapterNum) {
    localStorage.setItem(key(studentName, 'chapter', chapterNum, 'complete'), 'true');
  },
  getCompletedChapters(studentName) {
    const completed = [];
    for (let i = 1; i <= 16; i++) {
      if (this.isChapterComplete(studentName, i)) completed.push(i);
    }
    return completed;
  },

  // Quiz scores
  getQuizScore(studentName, weekId) {
    const data = localStorage.getItem(key(studentName, 'quiz', `week${weekId}`));
    return data ? JSON.parse(data) : null;
  },
  saveQuizScore(studentName, weekId, result) {
    localStorage.setItem(key(studentName, 'quiz', `week${weekId}`), JSON.stringify({
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      date: new Date().toISOString(),
      answers: result.answers,
    }));
  },

  // Final exam
  getFinalExamScore(studentName) {
    const data = localStorage.getItem(key(studentName, 'final-exam'));
    return data ? JSON.parse(data) : null;
  },
  saveFinalExamScore(studentName, result) {
    localStorage.setItem(key(studentName, 'final-exam'), JSON.stringify({
      score: result.score,
      total: result.total,
      percentage: result.percentage,
      date: new Date().toISOString(),
      answers: result.answers,
    }));
  },

  // Practice completion
  getPracticeCompleted(studentName, weekId) {
    const data = localStorage.getItem(key(studentName, 'practice', `week${weekId}`));
    return data ? JSON.parse(data) : [];
  },
  markPracticeComplete(studentName, weekId, problemId) {
    const completed = this.getPracticeCompleted(studentName, weekId);
    if (!completed.includes(problemId)) {
      completed.push(problemId);
      localStorage.setItem(key(studentName, 'practice', `week${weekId}`), JSON.stringify(completed));
    }
  },

  // Discussion posts
  getDiscussionPosts(weekId) {
    const data = localStorage.getItem(key('discussions', `week${weekId}`));
    return data ? JSON.parse(data) : [];
  },
  addDiscussionPost(weekId, post) {
    const posts = this.getDiscussionPosts(weekId);
    post.id = Date.now();
    post.date = new Date().toISOString();
    post.replies = [];
    posts.push(post);
    localStorage.setItem(key('discussions', `week${weekId}`), JSON.stringify(posts));
    return post;
  },
  addReply(weekId, postId, reply) {
    const posts = this.getDiscussionPosts(weekId);
    const post = posts.find(p => p.id === postId);
    if (post) {
      reply.id = Date.now();
      reply.date = new Date().toISOString();
      post.replies.push(reply);
      localStorage.setItem(key('discussions', `week${weekId}`), JSON.stringify(posts));
    }
    return reply;
  },

  // Formation reading completion
  isFormationComplete(studentName, weekId) {
    return localStorage.getItem(key(studentName, 'formation', `week${weekId}`)) === 'true';
  },
  setFormationComplete(studentName, weekId) {
    localStorage.setItem(key(studentName, 'formation', `week${weekId}`), 'true');
  },

  // Case study responses
  getCaseResponse(studentName, weekId) {
    const data = localStorage.getItem(key(studentName, 'case', `week${weekId}`));
    return data ? JSON.parse(data) : null;
  },
  saveCaseResponse(studentName, weekId, response) {
    response.lastSaved = new Date().toISOString();
    localStorage.setItem(key(studentName, 'case', `week${weekId}`), JSON.stringify(response));
  },

  // Case study AI grades
  getCaseGrade(studentName, weekId) {
    const data = localStorage.getItem(key(studentName, 'case-grade', `week${weekId}`));
    return data ? JSON.parse(data) : null;
  },
  saveCaseGrade(studentName, weekId, grades) {
    grades.gradedDate = new Date().toISOString();
    localStorage.setItem(key(studentName, 'case-grade', `week${weekId}`), JSON.stringify(grades));
  },

  // Compute overall progress for a student
  getProgress(studentName) {
    const chaptersCompleted = this.getCompletedChapters(studentName).length;
    const totalChapters = 16;

    let quizzesTaken = 0;
    let quizTotal = 0;
    let quizEarned = 0;
    for (let w = 1; w <= 5; w++) {
      const q = this.getQuizScore(studentName, w);
      if (q) {
        quizzesTaken++;
        quizEarned += q.score;
        quizTotal += q.total;
      }
    }

    const finalExam = this.getFinalExamScore(studentName);

    return {
      chaptersCompleted,
      totalChapters,
      chapterPercent: Math.round((chaptersCompleted / totalChapters) * 100),
      quizzesTaken,
      totalQuizzes: 5,
      quizAverage: quizTotal > 0 ? Math.round((quizEarned / quizTotal) * 100) : 0,
      finalExam,
    };
  },
};

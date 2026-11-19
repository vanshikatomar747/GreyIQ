import { create } from 'zustand';

export const API_BASE = import.meta.env.VITE_API_URL || '/api';

export const useAppStore = create((set, get) => ({
  // AUTH STATE
  user: JSON.parse(localStorage.getItem('greyiq_user')) || null,
  token: localStorage.getItem('greyiq_token') || null,
  isAuthenticated: !!localStorage.getItem('greyiq_token'),
  authLoading: false,
  authError: null,

  // TEST PORTAL STATE
  activeTest: null,
  activeSectionIndex: 0,
  testAnswers: {}, // Format: { questionId: selectedOption }
  timerRemaining: 0, // In seconds
  testLoading: false,
  testError: null,
  testSubmissionResult: null,
  startedAt: null,
  certificationStatus: null,


  // ADMIN STATE
  students: [],
  questions: [],
  certifications: [],
  messages: [],
  adminLoading: false,
  adminError: null,

  // AUTH ACTIONS
  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || 'Login failed');

      localStorage.setItem('greyiq_token', data.token);
      localStorage.setItem('greyiq_user', JSON.stringify(data));

      set({
        user: data,
        token: data.token,
        isAuthenticated: true,
        authLoading: false
      });
      return data;
    } catch (error) {
      set({ authLoading: false, authError: error.message });
      throw error;
    }
  },

  register: async (name, email, password, role) => {
    set({ authLoading: true, authError: null });
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('greyiq_token', data.token);
      localStorage.setItem('greyiq_user', JSON.stringify(data));

      set({
        user: data,
        token: data.token,
        isAuthenticated: true,
        authLoading: false
      });
      return data;
    } catch (error) {
      set({ authLoading: false, authError: error.message });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('greyiq_token');
    localStorage.removeItem('greyiq_user');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      testAnswers: {},
      activeTest: null,
      certificationStatus: null
    });
  },

  // TEST PORTAL ACTIONS
  fetchTestStructure: async (testId) => {
    set({ testLoading: true, testError: null, testSubmissionResult: null });
    try {
      const headers = { 'Authorization': `Bearer ${get().token}` };
      const res = await fetch(`${API_BASE}/tests/${testId}/questions`, { headers });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || 'Failed to fetch test questions');

      // Initialize answers from localstorage if page reloaded
      const cachedAnswersKey = `greyiq_answers_${testId}`;
      const savedAnswers = JSON.parse(localStorage.getItem(cachedAnswersKey)) || {};

      set({
        activeTest: data,
        testAnswers: savedAnswers,
        activeSectionIndex: 0,
        testLoading: false,
        startedAt: new Date().toISOString()
      });
      
      // Start timer for the first section
      if (data.sections && data.sections.length > 0) {
        set({ timerRemaining: data.sections[0].timerMinutes * 60 });
      }
      return data;
    } catch (error) {
      set({ testLoading: false, testError: error.message });
      throw error;
    }
  },

  saveAnswer: (questionId, selectedOption) => {
    const { testAnswers, activeTest } = get();
    const updatedAnswers = { ...testAnswers, [questionId]: selectedOption };
    
    set({ testAnswers: updatedAnswers });

    if (activeTest) {
      localStorage.setItem(`greyiq_answers_${activeTest.testId}`, JSON.stringify(updatedAnswers));
    }
  },

  setTimerRemaining: (time) => {
    set({ timerRemaining: time });
  },

  nextSection: () => {
    const { activeSectionIndex, activeTest } = get();
    if (!activeTest) return;

    if (activeSectionIndex < activeTest.sections.length - 1) {
      const nextIndex = activeSectionIndex + 1;
      set({
        activeSectionIndex: nextIndex,
        timerRemaining: activeTest.sections[nextIndex].timerMinutes * 60
      });
    } else {
      // If we are on the last section, auto-submit the exam!
      get().submitTestSession();
    }
  },

  submitTestSession: async () => {
    const { activeTest, testAnswers, startedAt, token } = get();
    if (!activeTest) return;

    set({ testLoading: true, testError: null });
    try {
      // Format answers as array of { questionId, selectedOption }
      const answersPayload = [];
      Object.keys(activeTest.questions).forEach(sectionName => {
        activeTest.questions[sectionName].forEach(q => {
          const selected = testAnswers[q._id] || '';
          answersPayload.push({
            questionId: q._id,
            selectedOption: selected
          });
        });
      });

      // Calculate if the exam duration exceeded maximum permitted time limit
      const startedTime = new Date(startedAt).getTime();
      const totalMinutes = activeTest.sections.reduce((acc, s) => acc + (s.timerMinutes || 15), 0);
      const maxDurationMs = totalMinutes * 60 * 1000;
      const actualElapsedMs = Date.now() - startedTime;

      let completedAtStr = new Date().toISOString();
      if (actualElapsedMs > maxDurationMs + 5000) { // 5s buffer
        completedAtStr = new Date(startedTime + maxDurationMs).toISOString();
      }

      const res = await fetch(`${API_BASE}/tests/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          testId: activeTest.testId,
          answers: answersPayload,
          startedAt,
          completedAt: completedAtStr
        })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit test');

      // Clear cached answers
      localStorage.removeItem(`greyiq_answers_${activeTest.testId}`);

      set({
        testSubmissionResult: data,
        activeTest: null,
        testAnswers: {},
        testLoading: false
      });
      return data;
    } catch (error) {
      set({ testLoading: false, testError: error.message });
      throw error;
    }
  },

  // ADMIN ACTIONS
  fetchStudents: async () => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/students`, {
        headers: { 'Authorization': `Bearer ${get().token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch students list');

      set({ students: data, adminLoading: false });
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
    }
  },

  deleteStudent: async (id) => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/students/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${get().token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete student');

      await get().fetchStudents();
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
      throw error;
    }
  },

  createStudent: async (studentPayload) => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${get().token}`
        },
        body: JSON.stringify(studentPayload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create student');

      await get().fetchStudents();
      return data;
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
      throw error;
    }
  },



  fetchQuestionPool: async () => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/questions`, {
        headers: { 'Authorization': `Bearer ${get().token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch question pool');

      set({ questions: data, adminLoading: false });
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
    }
  },

  createQuestion: async (questionPayload) => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${get().token}`
        },
        body: JSON.stringify(questionPayload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create question');

      await get().fetchQuestionPool();
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
      throw error;
    }
  },

  updateQuestion: async (id, questionPayload) => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/questions/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${get().token}`
        },
        body: JSON.stringify(questionPayload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update question');

      await get().fetchQuestionPool();
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
      throw error;
    }
  },

  deleteQuestion: async (id) => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/questions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${get().token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete question');

      await get().fetchQuestionPool();
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
      throw error;
    }
  },

  bulkUploadQuestions: async (questionsArray) => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/questions/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${get().token}`
        },
        body: JSON.stringify({ questions: questionsArray })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed bulk upload');

      await get().fetchQuestionPool();
      return data;
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
      throw error;
    }
  },

  updateTestTimers: async (testId, sectionsPayload) => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/tests/${testId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${get().token}`
        },
        body: JSON.stringify({ sections: sectionsPayload })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update settings');

      return data;
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
      throw error;
    }
  },

  applyForCertification: async (payload) => {
    set({ testLoading: true, testError: null });
    try {
      const res = await fetch(`${API_BASE}/tests/certifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${get().token}`
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit application');
      set({ testLoading: false, certificationStatus: data.application });
      return data;
    } catch (error) {
      set({ testLoading: false, testError: error.message });
      throw error;
    }
  },

  fetchCertificationStatus: async () => {
    set({ testLoading: true, testError: null });
    try {
      const res = await fetch(`${API_BASE}/tests/certifications/status`, {
        headers: { 'Authorization': `Bearer ${get().token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch certification status');
      set({ certificationStatus: data, testLoading: false });
      return data;
    } catch (error) {
      set({ testLoading: false, testError: error.message });
      return null; // Don't throw to prevent dashboard loading crashes
    }
  },

  fetchCertifications: async () => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/certifications`, {
        headers: { 'Authorization': `Bearer ${get().token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch certifications');
      set({ certifications: data, adminLoading: false });
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
    }
  },

  updateCertificationStatus: async (id, status) => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/certifications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${get().token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update certification status');
      await get().fetchCertifications();
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
      throw error;
    }
  },

  deleteCertification: async (id) => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/certifications/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${get().token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete certification');
      await get().fetchCertifications();
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
      throw error;
    }
  },

  resetStudentTest: async (studentId, testId) => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/students/${studentId}/reset-test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${get().token}`
        },
        body: JSON.stringify({ testId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to reset student test');
      await get().fetchStudents();
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
      throw error;
    }
  },

  fetchMessages: async () => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/messages`, {
        headers: { 'Authorization': `Bearer ${get().token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch messages');

      set({ messages: data, adminLoading: false });
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
    }
  },

  deleteMessage: async (id) => {
    set({ adminLoading: true, adminError: null });
    try {
      const res = await fetch(`${API_BASE}/admin/messages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${get().token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete message');

      await get().fetchMessages();
    } catch (error) {
      set({ adminLoading: false, adminError: error.message });
      throw error;
    }
  }
}
));

// Global fetch interceptor to automatically log out on any 401 Unauthorized responses (e.g. database re-seeding)
const originalFetch = window.fetch;
window.fetch = async function (...args) {
  const response = await originalFetch(...args);
  if (response.status === 401) {
    let url = '';
    if (typeof args[0] === 'string') {
      url = args[0];
    } else if (args[0] && typeof args[0] === 'object') {
      url = args[0].url || (typeof args[0].toString === 'function' ? args[0].toString() : '');
    }
    
    if (!url.includes('/auth/login') && !url.includes('/auth/register')) {
      setTimeout(() => {
        useAppStore.getState().logout();
      }, 0);
    }
  }
  return response;
};

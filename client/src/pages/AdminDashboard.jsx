import { useEffect, useState } from 'react';
import { useAppStore, API_BASE } from '../store/useAppStore';
import { 
  Users, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Upload, 
  Check, 
  Clock, 
  Sliders, 
  Award,
  Mail,
  Download,
  RotateCcw
} from 'lucide-react';

const parseCSV = (csvText) => {
  const lines = [];
  let row = [""];
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const c = csvText[i];
    const next = csvText[i + 1];

    if (c === '"') {
      if (inQuotes && next === '"') {
        row[row.length - 1] += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (c === ',' && !inQuotes) {
      row.push('');
    } else if ((c === '\r' || c === '\n') && !inQuotes) {
      if (c === '\r' && next === '\n') {
        i++;
      }
      lines.push(row);
      row = [""];
    } else {
      row[row.length - 1] += c;
    }
  }
  if (row.length > 1 || row[0] !== '') {
    lines.push(row);
  }

  if (lines.length < 2) {
    throw new Error('CSV must contain a header row and at least one data row.');
  }

  const headers = lines[0].map(h => h.trim().toLowerCase());
  
  const questionIdx = headers.indexOf('question');
  const sectionIdx = headers.indexOf('section');
  const opt1Idx = headers.indexOf('option1');
  const opt2Idx = headers.indexOf('option2');
  const opt3Idx = headers.indexOf('option3');
  const opt4Idx = headers.indexOf('option4');
  const correctIdx = headers.indexOf('correctanswer');

  if (questionIdx === -1 || sectionIdx === -1 || opt1Idx === -1 || opt2Idx === -1 || opt3Idx === -1 || opt4Idx === -1 || correctIdx === -1) {
    throw new Error('CSV must have columns: "question", "section", "option1", "option2", "option3", "option4", and "correctAnswer".');
  }

  const parsedQuestions = [];
  for (let i = 1; i < lines.length; i++) {
    const r = lines[i];
    if (r.length <= 1 && r[0] === '') continue;

    const question = r[questionIdx]?.trim() || '';
    const section = r[sectionIdx]?.trim() || '';
    const option1 = r[opt1Idx]?.trim() || '';
    const option2 = r[opt2Idx]?.trim() || '';
    const option3 = r[opt3Idx]?.trim() || '';
    const option4 = r[opt4Idx]?.trim() || '';
    const correctAnswer = r[correctIdx]?.trim() || '';

    if (!question || !section || !option1 || !option2 || !option3 || !option4 || !correctAnswer) {
      throw new Error(`Row ${i + 1} has missing fields.`);
    }

    parsedQuestions.push({
      section,
      question,
      options: [option1, option2, option3, option4],
      correctAnswer
    });
  }

  return parsedQuestions;
};

export default function AdminDashboard() {
  const {
    token,
    students,
    questions,
    certifications,
    messages,
    fetchStudents,
    fetchQuestionPool,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    bulkUploadQuestions,
    updateTestTimers,
    deleteStudent,
    createStudent,
    fetchCertifications,
    updateCertificationStatus,
    deleteCertification,
    resetStudentTest,
    fetchMessages,
    deleteMessage
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [certSearchQuery, setCertSearchQuery] = useState('');
  const [certStatusFilter, setCertStatusFilter] = useState('all');
  
  // Tests list for dropdowns
  const [tests, setTests] = useState([]);

  // Question search, filter & pagination state
  const [qSearch, setQSearch] = useState('');
  const [qSectionFilter, setQSectionFilter] = useState('');
  const [qPage, setQPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setQPage(1), 0);
    return () => clearTimeout(timer);
  }, [qSearch, qSectionFilter]);

  const uniqueSections = Array.isArray(questions)
    ? Array.from(new Set(questions.map(q => q.section))).filter(Boolean)
    : [];

  const filteredQuestions = Array.isArray(questions)
    ? questions.filter(q => {
        const matchesSearch = q.question?.toLowerCase().includes(qSearch.toLowerCase());
        const matchesSection = qSectionFilter ? q.section === qSectionFilter : true;
        return matchesSearch && matchesSection;
      })
    : [];

  const ITEMS_PER_PAGE = 10;
  const pageCount = Math.ceil(filteredQuestions.length / ITEMS_PER_PAGE);
  const paginatedQuestions = filteredQuestions.slice((qPage - 1) * ITEMS_PER_PAGE, qPage * ITEMS_PER_PAGE);
  
  // Question Modal State
  const [showQModal, setShowQModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [qFormData, setQFormData] = useState({
    testId: '',
    section: '',
    question: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: ''
  });

  // Bulk Upload State
  const [bulkJson, setBulkJson] = useState('');
  const [bulkTestId, setBulkTestId] = useState('');
  const [bulkStatus, setBulkStatus] = useState('');

  // Test settings state
  const [selectedTestSettings, setSelectedTestSettings] = useState('');
  const [testSections, setTestSections] = useState([]);
  const [settingsStatus, setSettingsStatus] = useState('');

  // Student modal state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    email: '',
    password: 'student123'
  });

  useEffect(() => {
    fetchStudents();
    fetchQuestionPool();
    fetchCertifications();
    fetchMessages();
    
    // Fetch tests for configuration
    const fetchTestsList = async () => {
      try {
        const res = await fetch(`${API_BASE}/tests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch tests');
        if (Array.isArray(data)) {
          setTests(data);
          if (data.length > 0) {
            setBulkTestId(data[0]._id);
            setSelectedTestSettings(data[0]._id);
            setTestSections(data[0].sections);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchTestsList();
  }, [token, fetchStudents, fetchQuestionPool, fetchCertifications, fetchMessages]);

  const handleTestSettingsChange = (testId) => {
    setSelectedTestSettings(testId);
    const selectedTest = tests.find(t => t._id === testId);
    if (selectedTest) {
      setTestSections(selectedTest.sections);
    }
  };

  const handleUpdateTimer = (index, value) => {
    const updated = [...testSections];
    updated[index].timerMinutes = value === '' ? '' : parseInt(value);
    setTestSections(updated);
  };

  const handleSaveTestSettings = async (e) => {
    e.preventDefault();
    setSettingsStatus('');
    try {
      const sanitizedSections = testSections.map(sec => ({
        name: sec.name,
        timerMinutes: Math.max(1, parseInt(sec.timerMinutes) || 5)
      }));
      await updateTestTimers(selectedTestSettings, sanitizedSections);
      setSettingsStatus('Settings updated successfully!');
      
      // Update tests list in local state
      const res = await fetch(`${API_BASE}/tests`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to refresh tests');
      if (Array.isArray(data)) {
        setTests(data);
      }
      
      setTimeout(() => setSettingsStatus(''), 3000);
    } catch (err) {
      setSettingsStatus('Error: ' + err.message);
    }
  };

  const openQModal = (q = null) => {
    if (q) {
      setEditingQuestion(q);
      setQFormData({
        testId: q.testId?._id || q.testId || '',
        section: q.section,
        question: q.question,
        optionA: q.options[0] || '',
        optionB: q.options[1] || '',
        optionC: q.options[2] || '',
        optionD: q.options[3] || '',
        correctAnswer: q.correctAnswer
      });
    } else {
      setEditingQuestion(null);
      setQFormData({
        testId: tests[0]?._id || '',
        section: tests[0]?.sections[0]?.name || '',
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: ''
      });
    }
    setShowQModal(true);
  };

  const handleQFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      testId: qFormData.testId,
      section: qFormData.section,
      question: qFormData.question,
      options: [qFormData.optionA, qFormData.optionB, qFormData.optionC, qFormData.optionD],
      correctAnswer: qFormData.correctAnswer
    };

    try {
      if (editingQuestion) {
        await updateQuestion(editingQuestion._id, payload);
      } else {
        await createQuestion(payload);
      }
      setShowQModal(false);
    } catch (err) {
      alert('Error saving question: ' + err.message);
    }
  };

  const handleDeleteQ = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await deleteQuestion(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student account? All their responses and reports will be permanently deleted.')) {
      try {
        await deleteStudent(id);
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleDeleteCertification = async (id) => {
    if (window.confirm('Are you sure you want to delete this certification application? This action cannot be undone.')) {
      try {
        await deleteCertification(id);
      } catch (err) {
        alert('Error deleting application: ' + err.message);
      }
    }
  };

  const handleResetTest = async (studentId, testId, testTitle) => {
    if (!testId) {
      alert('Error: Test configuration not found in database.');
      return;
    }
    if (window.confirm(`Are you sure you want to reset ${testTitle} for this student? This will permanently delete their answers and allow them to take the test again.`)) {
      try {
        await resetStudentTest(studentId, testId);
      } catch (err) {
        alert('Error resetting test: ' + err.message);
      }
    }
  };

  const handleStudentFormSubmit = async (e) => {
    e.preventDefault();
    try {
      await createStudent(studentFormData);
      setShowStudentModal(false);
      setStudentFormData({ name: '', email: '', password: 'student123' });
    } catch (err) {
      alert('Error creating student account: ' + err.message);
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setBulkStatus('');
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(text);
          if (!Array.isArray(parsed)) throw new Error('JSON file must be a questions array.');
          setBulkJson(JSON.stringify(parsed, null, 2));
          setBulkStatus(`Successfully parsed ${parsed.length} questions from JSON file! You can review below.`);
        } else if (file.name.endsWith('.csv')) {
          const parsed = parseCSV(text);
          setBulkJson(JSON.stringify(parsed, null, 2));
          setBulkStatus(`Successfully parsed ${parsed.length} questions from CSV file! You can review below.`);
        } else {
          throw new Error('Unsupported file format. Please upload .csv or .json.');
        }
      } catch (err) {
        setBulkStatus('Error parsing file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleBulkUpload = async (e) => {
    e.preventDefault();
    setBulkStatus('');
    try {
      const questionsArray = JSON.parse(bulkJson);
      if (!Array.isArray(questionsArray)) {
        throw new Error('JSON content must be an array of objects');
      }

      const formatted = questionsArray.map(q => ({
        testId: bulkTestId,
        section: q.section,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));

      const res = await bulkUploadQuestions(formatted);
      setBulkStatus(`Successfully uploaded ${res.count} questions!`);
      setBulkJson('');
      setTimeout(() => setBulkStatus(''), 4000);
    } catch (err) {
      setBulkStatus('Error parsing JSON or uploading: ' + err.message);
    }
  };

  const handleExportStudents = () => {
    // Export data as JSON file
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(students, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "greyiq_solutions_students_report.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter students based on search and status
  const filteredStudents = students.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (statusFilter === 'completed_both') {
      return s.report?.test1Analysis?.completedAt && s.report?.test2Analysis?.completedAt;
    } else if (statusFilter === 'completed_one') {
      return (s.report?.test1Analysis?.completedAt && !s.report?.test2Analysis?.completedAt) || (!s.report?.test1Analysis?.completedAt && s.report?.test2Analysis?.completedAt);
    } else if (statusFilter === 'no_attempts') {
      return s.attempts === 0;
    }
    
    return true;
  });

  // Filter certifications based on search and status
  const filteredCertifications = (certifications || []).filter(c => {
    const nameMatch = (c.name || '').toLowerCase().includes(certSearchQuery.toLowerCase()) || 
                      (c.email || '').toLowerCase().includes(certSearchQuery.toLowerCase()) ||
                      (c.collegeName || '').toLowerCase().includes(certSearchQuery.toLowerCase()) ||
                      (c.rollNo || '').toLowerCase().includes(certSearchQuery.toLowerCase());
    
    if (!nameMatch) return false;
    if (certStatusFilter !== 'all' && c.status !== certStatusFilter) return false;
    return true;
  });

  const test1Id = tests.find(t => t.title.includes('1'))?._id;
  const test2Id = tests.find(t => t.title.includes('2'))?._id;

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-16 relative z-10 min-h-[90vh]">
      
      {/* Tab Select Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Academic Console</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">Administration Panel</h1>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-1 bg-white/5 border border-white/10 p-1 rounded-xl w-full sm:w-fit justify-start">
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'students' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Students
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'questions' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Question Manager
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'bulk' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bulk Uploader
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'settings' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Test Settings
          </button>
          <button
            onClick={() => setActiveTab('certifications')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'certifications' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Certifications
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'messages' ? 'bg-primary text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Inbox
          </button>
        </div>
      </div>

      {/* ======================== TAB: STUDENTS ======================== */}
      {activeTab === 'students' && (
        <div className="space-y-6">
          {/* Top Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Students</span>
                <span className="text-2xl font-extrabold text-white block mt-1">{students.length}</span>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Completed Both</span>
                <span className="text-2xl font-extrabold text-accent block mt-1">
                  {students.filter(s => s.report?.test1Analysis?.completedAt && s.report?.test2Analysis?.completedAt).length}
                </span>
              </div>
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center text-accent">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Active Assessed</span>
                <span className="text-2xl font-extrabold text-secondary block mt-1">
                  {students.filter(s => s.attempts > 0).length}
                </span>
              </div>
              <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
                <Sliders className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Student Filter Toolbar */}
          <div className="glass-panel p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search student ledger..."
                className="w-full glass-input pl-9 pr-4 py-2 text-xs rounded-lg"
              />
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="glass-input px-3 py-2 text-xs rounded-lg bg-slate-900 border border-white/10 grow sm:grow-0"
              >
                <option value="all">All Student Statuses</option>
                <option value="completed_both">Completed Both Tests</option>
                <option value="completed_one">Completed One Test</option>
                <option value="no_attempts">No Attempts</option>
              </select>

              <button
                onClick={() => setShowStudentModal(true)}
                className="flex items-center justify-center space-x-1.5 text-xs font-bold text-white bg-primary hover:bg-primary/80 rounded-lg px-4 py-2.5 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Student</span>
              </button>

              <button
                onClick={handleExportStudents}
                className="flex items-center justify-center space-x-1.5 text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-4 py-2.5 shrink-0"
              >
                <Download className="w-4 h-4 text-secondary" />
                <span>Export JSON</span>
              </button>
            </div>
          </div>

          {/* Student Table */}
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02] uppercase text-[10px] font-bold text-slate-400 tracking-wider">
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4 hidden sm:table-cell">Email</th>
                    <th className="px-6 py-4 text-center">Attempts</th>
                    <th className="px-6 py-4 text-center">Test 1 Score</th>
                    <th className="px-6 py-4 text-center">Test 2 Score</th>
                    <th className="px-6 py-4 text-center">Placement Readiness</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03] text-slate-300">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map(student => {
                      const t1Score = student.report?.test1Analysis?.score;
                      const t1Total = student.report?.test1Analysis?.totalQuestions;
                      const t2Score = student.report?.test2Analysis?.score;
                      const t2Total = student.report?.test2Analysis?.totalQuestions;
                      const readiness = student.report?.improvementMetrics?.placementReadinessScore;

                      return (
                        <tr key={student._id} className="hover:bg-white/[0.01] transition-colors border-b border-white/[0.01] last:border-b-0">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              {/* Avatar bubble */}
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary/10 to-secondary/15 border border-primary/10 flex items-center justify-center font-bold text-xs text-secondary shrink-0">
                                {student.name ? student.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'ST'}
                              </div>
                              <div>
                                <span className="font-semibold text-white text-sm block">{student.name}</span>
                                <span className="text-[10px] text-slate-500 block sm:hidden mt-0.5 font-medium">{student.email}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 hidden sm:table-cell text-slate-400 font-medium">{student.email}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 font-bold text-xs">
                              {student.attempts}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            {t1Score !== undefined ? (
                              <div className="flex items-center justify-center gap-2">
                                <span className="px-2.5 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-bold tracking-wide">
                                  {t1Score} / {t1Total}
                                </span>
                                <button
                                  onClick={() => handleResetTest(student._id, test1Id, 'Test 1')}
                                  className="p-1 text-slate-500 hover:text-secondary hover:bg-secondary/10 rounded-md transition-all"
                                  title="Reset Test 1 (Retake)"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-600 font-light">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {t2Score !== undefined ? (
                              <div className="flex items-center justify-center gap-2">
                                <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-wide">
                                  {t2Score} / {t2Total}
                                </span>
                                <button
                                  onClick={() => handleResetTest(student._id, test2Id, 'Test 2')}
                                  className="p-1 text-slate-500 hover:text-primary hover:bg-primary/10 rounded-md transition-all"
                                  title="Reset Test 2 (Retake)"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-600 font-light">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {readiness !== undefined ? (
                              <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-[11px] font-extrabold">
                                {readiness}%
                              </span>
                            ) : (
                              <span className="text-slate-600 font-light">—</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => handleDeleteStudent(student._id)}
                              className="p-1.5 text-slate-500 hover:text-highlight hover:bg-highlight/10 rounded-lg transition-all"
                              title="Delete Student"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-slate-500 font-semibold">
                        No students found matching filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================== TAB: QUESTIONS ======================== */}
      {activeTab === 'questions' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-wide">Question Bank ledger ({filteredQuestions.length} items)</h2>
            <button
              onClick={() => openQModal()}
              className="btn-glow px-4 py-2 rounded-lg text-xs font-bold text-white flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question</span>
            </button>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 bg-white/2 border border-white/5 p-4 rounded-xl">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={qSearch}
                onChange={(e) => setQSearch(e.target.value)}
                placeholder="Search question text..."
                className="w-full glass-input pl-9 pr-4 py-2.5 rounded-lg text-xs text-white"
              />
            </div>
            
            <div className="w-full sm:w-48">
              <select
                value={qSectionFilter}
                onChange={(e) => setQSectionFilter(e.target.value)}
                className="w-full glass-input px-3 py-2.5 rounded-lg text-xs bg-slate-900 text-slate-350 border-white/5"
              >
                <option value="">All Sections</option>
                {uniqueSections.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {paginatedQuestions.length > 0 ? (
              paginatedQuestions.map((q) => (
                <div key={q._id} className="glass-panel p-5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 pb-3 mb-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center space-x-2">
                      <span className="text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full">{q.testId?.title || 'Unknown Test'}</span>
                      <span className="text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-full">{q.section}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => openQModal(q)}
                        className="flex items-center space-x-1 hover:text-secondary text-slate-400 transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button 
                        onClick={() => handleDeleteQ(q._id)}
                        className="flex items-center space-x-1 hover:text-highlight text-slate-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>

                  <h4 className="text-sm font-bold text-white mb-3 tracking-wide leading-relaxed">{q.question}</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {q.options.map((opt, i) => {
                      const isCorrect = opt === q.correctAnswer;
                      return (
                        <div 
                          key={i} 
                          className={`px-3.5 py-2 rounded-lg text-xs flex items-center justify-between border ${
                            isCorrect 
                              ? 'bg-accent/10 border-accent/30 text-accent font-semibold' 
                              : 'bg-white/2 border-white/5 text-slate-400'
                          }`}
                        >
                          <span>{opt}</span>
                          {isCorrect && <span className="text-[9px] uppercase font-bold text-accent">Correct</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 text-xs text-slate-500">No questions found matching criteria.</p>
            )}
          </div>

          {/* Pagination Controls */}
          {pageCount > 1 && (
            <div className="flex items-center justify-between border-t border-white/5 pt-4">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Page {qPage} of {pageCount} ({filteredQuestions.length} items)
              </span>
              <div className="flex items-center space-x-2">
                <button
                  disabled={qPage === 1}
                  onClick={() => setQPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 bg-white/5 border border-white/5 text-xs text-slate-350 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                <button
                  disabled={qPage === pageCount}
                  onClick={() => setQPage(prev => Math.min(prev + 1, pageCount))}
                  className="px-3 py-1.5 bg-white/5 border border-white/5 text-xs text-slate-350 rounded-lg hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================== TAB: BULK UPLOADER ======================== */}
      {activeTab === 'bulk' && (
        <div className="max-w-2xl glass-panel p-8 rounded-2xl border border-white/5">
          <h3 className="text-base font-bold text-white mb-3">Bulk Upload JSON</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Input a raw JSON array of questions to bulk populate the selected test pool.
          </p>

          {bulkStatus && (
            <div className="flex items-center space-x-2 bg-primary/10 border border-primary/20 text-white rounded-lg p-3.5 text-xs mb-6 font-semibold">
              <span>{bulkStatus}</span>
            </div>
          )}

          <form onSubmit={handleBulkUpload} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target Test Pool</label>
              <select
                value={bulkTestId}
                onChange={(e) => setBulkTestId(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-lg text-sm bg-slate-900"
              >
                {tests.map(t => (
                  <option key={t._id} value={t._id}>{t.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Import from file (JSON or CSV)</label>
              <input
                type="file"
                accept=".csv,.json"
                onChange={handleFileImport}
                className="w-full glass-input px-4 py-2 text-xs bg-slate-900 text-slate-300 border border-white/5 file:mr-4 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-primary file:text-white hover:file:opacity-90 file:cursor-pointer"
              />
              <span className="block text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                CSV headers required: <code className="font-mono text-slate-400 bg-white/5 px-1 py-0.5 rounded">question, section, option1, option2, option3, option4, correctAnswer</code>
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">JSON Content Payload</label>
              <textarea
                value={bulkJson}
                onChange={(e) => setBulkJson(e.target.value)}
                required
                rows="8"
                placeholder={`[
  {
    "section": "English Basics & Grammar",
    "question": "Choose the correct pronoun form.",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "Option A"
  }
]`}
                className="w-full glass-input p-4 rounded-lg text-xs font-mono resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-glow py-3 rounded-lg text-sm font-semibold text-white flex items-center justify-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Perform Bulk Insertion</span>
            </button>
          </form>
        </div>
      )}

      {/* ======================== TAB: TEST SETTINGS ======================== */}
      {activeTab === 'settings' && (
        <div className="max-w-2xl glass-panel p-8 rounded-2xl border border-white/5">
          <h3 className="text-base font-bold text-white mb-3">Adjust Section Timers</h3>
          <p className="text-xs text-slate-400 leading-relaxed mb-6">
            Modify the section-wise time bounds (in minutes). These updates apply instantly to new student test sessions.
          </p>

          {settingsStatus && (
            <div className="flex items-center space-x-2 bg-primary/10 border border-primary/20 text-white rounded-lg p-3.5 text-xs mb-6 font-semibold">
              <span>{settingsStatus}</span>
            </div>
          )}

          <form onSubmit={handleSaveTestSettings} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Select Test</label>
              <select
                value={selectedTestSettings}
                onChange={(e) => handleTestSettingsChange(e.target.value)}
                className="w-full glass-input px-4 py-3 rounded-lg text-sm bg-slate-900"
              >
                {tests.map(t => (
                  <option key={t._id} value={t._id}>{t.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Sections Timers Configuration</h4>
              {testSections.map((sec, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-white/2 border border-white/5 p-4 rounded-xl">
                  <div className="grow">
                    <span className="block text-xs font-semibold text-slate-500 uppercase">Section {idx+1}</span>
                    <span className="block text-sm font-bold text-white mt-0.5">{sec.name}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <input
                      type="number"
                      value={sec.timerMinutes}
                      onChange={(e) => handleUpdateTimer(idx, e.target.value)}
                      className="w-20 glass-input px-3 py-1.5 text-center text-sm rounded-lg"
                      min="1"
                    />
                    <span className="text-xs font-semibold text-slate-500">Mins</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full btn-glow py-3 rounded-lg text-sm font-semibold text-white flex items-center justify-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Apply Config Changes</span>
            </button>
          </form>
        </div>
      )}

      {/* ======================== TAB: CERTIFICATIONS ======================== */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          {/* Top Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Applications</span>
                <span className="text-2xl font-extrabold text-white block mt-1">{certifications?.length || 0}</span>
              </div>
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                <Award className="w-5 h-5" />
              </div>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Approved Certificates</span>
                <span className="text-2xl font-extrabold text-emerald-400 block mt-1">
                  {certifications?.filter(c => c.status === 'approved').length || 0}
                </span>
              </div>
              <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-400">
                <Check className="w-5 h-5" />
              </div>
            </div>
            <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pending Actions</span>
                <span className="text-2xl font-extrabold text-yellow-400 block mt-1">
                  {certifications?.filter(c => c.status === 'pending').length || 0}
                </span>
              </div>
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center text-yellow-400">
                <Clock className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Certifications Ledger Table */}
          <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Certification Ledger</h3>
                <p className="text-xs text-slate-400 mt-1">Review, approve, or reject student skill certifications.</p>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative grow sm:grow-0">
                  <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    value={certSearchQuery}
                    onChange={(e) => setCertSearchQuery(e.target.value)}
                    placeholder="Search ledger..."
                    className="w-full sm:w-60 glass-input pl-9 pr-4 py-2 text-xs rounded-lg"
                  />
                </div>
                <select
                  value={certStatusFilter}
                  onChange={(e) => setCertStatusFilter(e.target.value)}
                  className="glass-input px-3 py-2 text-xs rounded-lg bg-slate-900 text-slate-300 border border-white/5 focus:border-primary shrink-0"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">Student details</th>
                    <th className="py-4 px-6">Roll Number</th>
                    <th className="py-4 px-6">College / University</th>
                    <th className="py-4 px-6">Applied Date</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredCertifications.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-12 text-center text-xs text-slate-500">
                        No certification applications found matching the criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredCertifications.map((app) => (
                      <tr key={app._id} className="text-xs text-slate-300 hover:bg-white/2 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white">{app.name}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{app.email}</div>
                        </td>
                        <td className="py-4 px-6 font-mono text-slate-200">{app.rollNo}</td>
                        <td className="py-4 px-6">{app.collegeName}</td>
                        <td className="py-4 px-6 text-slate-400">
                          {new Date(app.appliedAt || app.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            app.status === 'approved' 
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                              : app.status === 'rejected'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20'
                              : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                          }`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {app.status !== 'approved' && (
                              <button
                                onClick={() => updateCertificationStatus(app._id, 'approved')}
                                className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-500 rounded-lg font-bold text-[10px] uppercase tracking-wide transition-all cursor-pointer"
                              >
                                Approve
                              </button>
                            )}
                            {app.status !== 'rejected' && (
                              <button
                                onClick={() => updateCertificationStatus(app._id, 'rejected')}
                                className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 rounded-lg font-bold text-[10px] uppercase tracking-wide transition-all cursor-pointer"
                              >
                                Reject
                              </button>
                            )}
                            {app.status === 'approved' && (
                              <span className="text-[10px] text-slate-500 italic">No further actions</span>
                            )}
                            <button
                              onClick={() => handleDeleteCertification(app._id)}
                              className="px-2.5 py-1.5 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/25 hover:border-red-500 rounded-lg font-bold text-[10px] uppercase transition-all cursor-pointer flex items-center justify-center"
                              title="Delete Application"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================== TAB: MESSAGES ======================== */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="glass-panel p-5 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Support Messages</span>
              <span className="text-2xl font-extrabold text-white block mt-1">{messages?.length || 0}</span>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <Mail className="w-5 h-5" />
            </div>
          </div>

          <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-xl bg-slate-950/40">
            <div className="p-6 border-b border-white/5">
              <h3 className="text-md font-bold text-white">Inbox Support Queries</h3>
              <p className="text-xs text-slate-400 mt-1">Read and manage queries sent through the contact form.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5 text-[10px] uppercase font-bold text-slate-300 tracking-wider">
                    <th className="py-3 px-6">Sender Details</th>
                    <th className="py-3 px-6">Message Content</th>
                    <th className="py-3 px-6">Submitted At</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs text-slate-300">
                  {(!messages || messages.length === 0) ? (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-slate-500 italic">No support messages found.</td>
                    </tr>
                  ) : (
                    messages.map((msg) => (
                      <tr key={msg._id} className="hover:bg-white/5 transition-all">
                        <td className="py-4 px-6">
                          <div className="font-bold text-white">{msg.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{msg.email}</div>
                        </td>
                        <td className="py-4 px-6 max-w-md">
                          <p className="whitespace-pre-wrap">{msg.message}</p>
                        </td>
                        <td className="py-4 px-6 text-slate-400 text-[10px]">
                          {new Date(msg.createdAt).toLocaleString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => {
                              if (window.confirm("Are you sure you want to delete this message?")) {
                                deleteMessage(msg._id);
                              }
                            }}
                            className="px-2.5 py-1.5 bg-red-950/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/25 hover:border-red-500 rounded-lg font-bold text-[10px] uppercase transition-all cursor-pointer inline-flex items-center justify-center"
                            title="Delete Message"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ======================== MODAL: ADD/EDIT QUESTION ======================== */}
      {showQModal && (
        <div className="fixed inset-0 bg-darkBg/80 backdrop-blur-sm z-[999] flex items-center justify-center p-6">
          <div className="w-full max-w-xl glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-white mb-6">
              {editingQuestion ? 'Modify Assessment Question' : 'Add Assessment Question'}
            </h3>

            <form onSubmit={handleQFormSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target Test</label>
                  <select
                    value={qFormData.testId}
                    onChange={(e) => {
                      const selTest = tests.find(t => t._id === e.target.value);
                      setQFormData({
                        ...qFormData,
                        testId: e.target.value,
                        section: selTest?.sections[0]?.name || ''
                      });
                    }}
                    className="w-full glass-input px-4 py-2 text-xs rounded-lg bg-slate-900"
                  >
                    {tests.map(t => (
                      <option key={t._id} value={t._id}>{t.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Target Section</label>
                  <select
                    value={qFormData.section}
                    onChange={(e) => setQFormData({ ...qFormData, section: e.target.value })}
                    className="w-full glass-input px-4 py-2 text-xs rounded-lg bg-slate-900"
                  >
                    {tests.find(t => t._id === qFormData.testId)?.sections.map((sec, i) => (
                      <option key={i} value={sec.name}>{sec.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Question Prompt Text</label>
                <textarea
                  value={qFormData.question}
                  onChange={(e) => setQFormData({ ...qFormData, question: e.target.value })}
                  required
                  rows="3"
                  placeholder="Enter the question query..."
                  className="w-full glass-input p-3 text-xs rounded-lg resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Option A</label>
                  <input
                    type="text"
                    required
                    value={qFormData.optionA}
                    onChange={(e) => setQFormData({ ...qFormData, optionA: e.target.value })}
                    placeholder="Option A value"
                    className="w-full glass-input px-4 py-2.5 text-xs rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Option B</label>
                  <input
                    type="text"
                    required
                    value={qFormData.optionB}
                    onChange={(e) => setQFormData({ ...qFormData, optionB: e.target.value })}
                    placeholder="Option B value"
                    className="w-full glass-input px-4 py-2.5 text-xs rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Option C</label>
                  <input
                    type="text"
                    required
                    value={qFormData.optionC}
                    onChange={(e) => setQFormData({ ...qFormData, optionC: e.target.value })}
                    placeholder="Option C value"
                    className="w-full glass-input px-4 py-2.5 text-xs rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Option D</label>
                  <input
                    type="text"
                    required
                    value={qFormData.optionD}
                    onChange={(e) => setQFormData({ ...qFormData, optionD: e.target.value })}
                    placeholder="Option D value"
                    className="w-full glass-input px-4 py-2.5 text-xs rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Declare Correct Answer Value</label>
                <select
                  value={qFormData.correctAnswer}
                  onChange={(e) => setQFormData({ ...qFormData, correctAnswer: e.target.value })}
                  required
                  className="w-full glass-input px-4 py-2 text-xs rounded-lg bg-slate-900"
                >
                  <option value="">-- Choose Option Value --</option>
                  {qFormData.optionA && <option value={qFormData.optionA}>Option A: {qFormData.optionA}</option>}
                  {qFormData.optionB && <option value={qFormData.optionB}>Option B: {qFormData.optionB}</option>}
                  {qFormData.optionC && <option value={qFormData.optionC}>Option C: {qFormData.optionC}</option>}
                  {qFormData.optionD && <option value={qFormData.optionD}>Option D: {qFormData.optionD}</option>}
                </select>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowQModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-3 rounded-xl font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-glow text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wide"
                >
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ======================== MODAL: ADD STUDENT ======================== */}
      {showStudentModal && (
        <div className="fixed inset-0 bg-darkBg/80 backdrop-blur-sm z-[999] flex items-center justify-center p-6">
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl relative">
            <h3 className="text-lg font-bold text-white mb-6">Create Student Account</h3>

            <form onSubmit={handleStudentFormSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Student Name</label>
                <input
                  type="text"
                  required
                  value={studentFormData.name}
                  onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full glass-input px-4 py-2.5 text-xs rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={studentFormData.email}
                  onChange={(e) => setStudentFormData({ ...studentFormData, email: e.target.value })}
                  placeholder="student@college.edu"
                  className="w-full glass-input px-4 py-2.5 text-xs rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Login Password</label>
                <input
                  type="text"
                  required
                  value={studentFormData.password}
                  onChange={(e) => setStudentFormData({ ...studentFormData, password: e.target.value })}
                  placeholder="Enter login password"
                  className="w-full glass-input px-4 py-2.5 text-xs rounded-lg"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Pre-populated with default password: student123</span>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-3 rounded-xl font-bold text-xs uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-glow text-white py-3 rounded-xl font-bold text-xs uppercase tracking-wide"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

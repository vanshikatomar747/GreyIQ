import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { ShieldAlert, ArrowRight, BookOpen, AlertCircle, Maximize, CheckSquare } from 'lucide-react';

export default function TestPortal() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const {
    activeTest,
    activeSectionIndex,
    testAnswers,
    timerRemaining,
    testLoading,
    fetchTestStructure,
    saveAnswer,
    setTimerRemaining,
    nextSection,
    submitTestSession
  } = useAppStore();

  const [examStarted, setExamStarted] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [, setIsFullScreen] = useState(false);
  const [fullscreenWarning, setFullscreenWarning] = useState(false);
  const [violationCount, setViolationCount] = useState(0);
  
  const timerIntervalRef = useRef(null);
  const sectionEndTimestampRef = useRef(null);
  const submittingRef = useRef(false);

  const triggerAutoSubmit = useCallback(async () => {
    if (submittingRef.current) return;
    submittingRef.current = true;
    setExamStarted(false); // Disable violation event processing immediately

    try {
      clearInterval(timerIntervalRef.current);
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
      await submitTestSession();
      navigate(activeTest?.title.includes('1') ? '/analysis/test1' : '/analysis/test2');
    } catch (err) {
      submittingRef.current = false; // Reset to allow retry if submission fails
      console.error(err);
      alert('Error submitting test: ' + err.message);
    }
  }, [activeTest, submitTestSession, navigate, setExamStarted]);

  const goToNextSection = useCallback(() => {
    const currentTest = activeTest;
    const currentIndex = activeSectionIndex;

    if (currentTest && currentIndex < currentTest.sections.length - 1) {
      nextSection();
      setActiveQuestionIndex(0);
    } else {
      // Last section finished -> auto submit
      triggerAutoSubmit();
    }
  }, [activeTest, activeSectionIndex, nextSection, setActiveQuestionIndex, triggerAutoSubmit]);

  const handleTimerExpiry = useCallback(() => {
    alert("Time is up for this section! Advancing to the next section.");
    goToNextSection();
  }, [goToNextSection]);

  const requestFullscreen = async () => {
    try {
      const element = document.documentElement;
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      }
      setIsFullScreen(true);
      setFullscreenWarning(false);
      setExamStarted(true);
    } catch (err) {
      console.error('Failed to enter fullscreen:', err);
      setExamStarted(true); // Fallback: start exam anyway
    }
  };

  // 1. Fetch test questions on load
  useEffect(() => {
    fetchTestStructure(testId).catch((err) => {
      console.error(err);
      navigate('/dashboard');
    });

    return () => {
      clearInterval(timerIntervalRef.current);
    };
  }, [testId, fetchTestStructure, navigate]);

  // 2. Fullscreen Change Listeners
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (submittingRef.current) return;
      const isFull = !!document.fullscreenElement;
      setIsFullScreen(isFull);
      if (examStarted && !isFull) {
        setFullscreenWarning(true);
        setViolationCount((prev) => {
          const nextVal = prev + 1;
          if (nextVal >= 3) {
            alert("Security policy violated: 3 window change/fullscreen exit violations detected. Submitting exam automatically.");
            triggerAutoSubmit();
          }
          return nextVal;
        });
      } else {
        setFullscreenWarning(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [examStarted, triggerAutoSubmit]);

  // Set/update the target end time whenever the active section index or exam start state changes
  useEffect(() => {
    if (!examStarted || !activeTest) return;
    const remaining = useAppStore.getState().timerRemaining;
    sectionEndTimestampRef.current = Date.now() + remaining * 1000;
  }, [examStarted, activeTest, activeSectionIndex]);

  // 3. Countdown timer logic (wall-clock based)
  useEffect(() => {
    if (!examStarted || !activeTest) return;

    clearInterval(timerIntervalRef.current);
    timerIntervalRef.current = setInterval(() => {
      if (!sectionEndTimestampRef.current) return;

      // Check total exam time limit (capping at the sum of all sections' limits)
      const startedAtTime = new Date(useAppStore.getState().startedAt).getTime();
      const totalMinutes = activeTest.sections.reduce((acc, s) => acc + (s.timerMinutes || 15), 0);
      const examEndTime = startedAtTime + (totalMinutes * 60 * 1000) + 5000; // 5s buffer

      if (Date.now() >= examEndTime) {
        clearInterval(timerIntervalRef.current);
        alert("Total exam time limit exceeded! Submitting your answers.");
        triggerAutoSubmit();
        return;
      }

      const secondsLeft = Math.round((sectionEndTimestampRef.current - Date.now()) / 1000);
      if (secondsLeft <= 0) {
        setTimerRemaining(0);
        clearInterval(timerIntervalRef.current);
        handleTimerExpiry();
      } else {
        setTimerRemaining(secondsLeft);
      }
    }, 500);

    return () => clearInterval(timerIntervalRef.current);
  }, [examStarted, activeTest, activeSectionIndex, handleTimerExpiry, setTimerRemaining, triggerAutoSubmit]);

  // 3.5. Page visibility change handler
  useEffect(() => {
    if (!examStarted || !activeTest) return;

    const handleVisibilityChange = () => {
      if (submittingRef.current) return;
      if (document.visibilityState === 'hidden') {
        setViolationCount((prev) => {
          const nextVal = prev + 1;
          if (nextVal >= 3) {
            alert("Security policy violated: 3 window change/fullscreen exit violations detected. Submitting exam automatically.");
            triggerAutoSubmit();
          } else {
            alert(`Security Warning: Tab switch or window blur detected. Violation ${nextVal}/3. Reaching 3 violations will automatically submit your exam.`);
          }
          return nextVal;
        });
      } else if (document.visibilityState === 'visible') {
        const startedAtTime = new Date(useAppStore.getState().startedAt).getTime();
        const totalMinutes = activeTest.sections.reduce((acc, s) => acc + (s.timerMinutes || 15), 0);
        const examEndTime = startedAtTime + (totalMinutes * 60 * 1000) + 5000;

        if (Date.now() >= examEndTime) {
          clearInterval(timerIntervalRef.current);
          alert("Total exam time limit exceeded! Submitting your answers.");
          triggerAutoSubmit();
          return;
        }

        if (sectionEndTimestampRef.current) {
          const secondsLeft = Math.round((sectionEndTimestampRef.current - Date.now()) / 1000);
          if (secondsLeft <= 0) {
            setTimerRemaining(0);
            clearInterval(timerIntervalRef.current);
            handleTimerExpiry();
          } else {
            setTimerRemaining(secondsLeft);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [examStarted, activeTest, activeSectionIndex, handleTimerExpiry, setTimerRemaining, triggerAutoSubmit]);



  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (testLoading && !activeTest) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!activeTest) return null;

  const currentSection = activeTest.sections[activeSectionIndex];
  const sectionQuestions = activeTest.questions[currentSection.name] || [];
  const currentQuestion = sectionQuestions[activeQuestionIndex];

  // Calculate stats for Submit Modal
  let totalTestQuestions = 0;
  Object.keys(activeTest.questions).forEach(sec => {
    totalTestQuestions += activeTest.questions[sec].length;
  });
  const answeredCount = Object.keys(testAnswers).length;

  // Render Enter Fullscreen Initial Overlay
  if (!examStarted) {
    return (
      <div className="min-h-[90vh] flex items-center justify-center px-6 pt-24 pb-12 relative z-10">
        <div className="w-full max-w-xl glass-panel p-8 rounded-3xl border border-white/5 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="w-16 h-16 rounded-2xl bg-primary/15 border border-primary/30 flex items-center justify-center text-primary mx-auto mb-6">
            <BookOpen className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold text-white tracking-wide">{activeTest.title} Portal</h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">
            This assessment requires full-screen exam mode. Opening other browser tabs or minimizing the window will trigger security indicators.
          </p>

          <div className="glass-panel p-5 rounded-xl border border-white/5 text-left my-6 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">Rules & Setup:</h4>
            <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4">
              <li>Section 1: <strong>{activeTest.sections[0].name}</strong> ({activeTest.sections[0].timerMinutes} mins)</li>
              <li>Section 2: <strong>{activeTest.sections[1].name}</strong> ({activeTest.sections[1].timerMinutes} mins)</li>
              <li>Section 3: <strong>{activeTest.sections[2].name}</strong> ({activeTest.sections[2].timerMinutes} mins)</li>
              <li>No going back to a section once the timer expires or you click 'Next Section'.</li>
              <li>Answers are automatically backed up. If your connection drops, refresh the page and enter full screen to resume.</li>
            </ul>
          </div>

          <button
            onClick={requestFullscreen}
            className="w-full btn-glow py-3.5 rounded-xl text-sm font-semibold text-white tracking-wide flex items-center justify-center space-x-2"
          >
            <Maximize className="w-4 h-4" />
            <span>Enter Full Screen & Start Exam</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkBg text-slate-100 relative z-10 pt-24 px-6 pb-12 flex flex-col md:flex-row gap-8 max-w-7xl mx-auto select-none">
      
      {/* 4. SECURITY OUT-OF-FULLSCREEN WARNING OVERLAY */}
      {fullscreenWarning && (
        <div className="fixed inset-0 bg-darkBg/95 backdrop-blur-md z-[999] flex items-center justify-center p-6">
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-highlight/30 text-center shadow-2xl">
            <ShieldAlert className="w-16 h-16 text-highlight mx-auto mb-6 animate-bounce" />
            <h2 className="text-2xl font-extrabold text-white">Security Deviation Detected</h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Assessment portal has lost full screen bounds. Please click below to restore full-screen mode immediately, or the session will auto-submit.
            </p>
            <div className="mt-4 p-3 bg-red-950/20 border border-red-500/20 text-red-400 text-xs font-bold rounded-xl uppercase tracking-wider">
              Violation Count: {violationCount} / 3
            </div>
            <button
              onClick={requestFullscreen}
              className="mt-6 w-full bg-highlight hover:bg-highlight-dark text-white py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg shadow-highlight/25"
            >
              Restore Full Screen Mode
            </button>
          </div>
        </div>
      )}

      {/* 5. MAIN QUESTIONS DASHBOARD AREA (Left & Center Columns) */}
      <div className="flex-grow space-y-6">
        
        {/* Test Section Header Bar */}
        <div className="glass-panel px-6 py-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Test Section ({activeSectionIndex + 1}/3)</span>
            <h2 className="text-lg font-bold text-white tracking-wide mt-0.5">{currentSection.name}</h2>
          </div>
          
          {/* Section Timer Display */}
          <div className={`flex items-center space-x-2.5 px-4 py-2 rounded-xl border ${
            timerRemaining < 60 
              ? 'bg-highlight/10 border-highlight/30 text-highlight animate-pulse' 
              : 'bg-white/5 border-white/10 text-secondary'
          }`}>
            <span className="text-xs font-semibold uppercase tracking-widest">Section Timer:</span>
            <span className="text-base font-extrabold">{formatTime(timerRemaining)}</span>
          </div>
        </div>

        {/* Active Question Display Card */}
        {currentQuestion ? (
          <div className="glass-panel p-8 rounded-2xl border border-white/5 min-h-[380px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
                  Question {activeQuestionIndex + 1} of {sectionQuestions.length}
                </span>
              </div>

              <h3 className="text-xl font-bold text-white leading-relaxed tracking-wide mb-8">
                {currentQuestion.question}
              </h3>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-4">
                {currentQuestion.options.map((option, idx) => {
                  const isSelected = testAnswers[currentQuestion._id] === option;
                  return (
                    <button
                      key={idx}
                      onClick={() => saveAnswer(currentQuestion._id, option)}
                      className={`w-full text-left px-5 py-4 rounded-xl border text-sm transition-all flex items-center justify-between ${
                        isSelected 
                          ? 'bg-primary/15 border-primary text-white font-semibold shadow-[0_0_15px_rgba(124,58,237,0.15)]' 
                          : 'bg-slate-900/50 border-white/5 text-slate-300 hover:border-white/15 hover:bg-slate-900/80'
                      }`}
                    >
                      <span>{option}</span>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ml-4 ${
                        isSelected ? 'border-primary bg-primary' : 'border-slate-600'
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Prev / Next Question Buttons */}
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
              <button
                disabled={activeQuestionIndex === 0}
                onClick={() => setActiveQuestionIndex(activeQuestionIndex - 1)}
                className="px-5 py-2.5 rounded-lg text-xs font-bold border border-white/10 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
              >
                Previous Question
              </button>
              
              {activeQuestionIndex < sectionQuestions.length - 1 ? (
                <button
                  onClick={() => setActiveQuestionIndex(activeQuestionIndex + 1)}
                  className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-xs font-bold transition-all"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={goToNextSection}
                  className="px-5 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-lg text-xs font-bold hover:shadow-lg flex items-center space-x-1"
                >
                  <span>{activeSectionIndex === 2 ? 'Submit Test' : 'Next Section'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </div>
        ) : (
          <div className="glass-panel p-8 rounded-2xl border border-white/5 min-h-[380px] flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-16 h-16 text-slate-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Questions Available</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-6 leading-relaxed">
              There are no questions configured for this section. Please proceed to the next section or submit your test.
            </p>
            {activeSectionIndex < activeTest.sections.length - 1 ? (
              <button
                onClick={goToNextSection}
                className="btn-glow px-6 py-2.5 text-white rounded-xl text-xs font-bold flex items-center space-x-1"
              >
                <span>Proceed to Next Section</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="btn-glow px-6 py-2.5 text-white rounded-xl text-xs font-bold"
              >
                Finish & Submit Exam
              </button>
            )}
          </div>
        )}

      </div>

      {/* 6. QUESTION PALETTE PANEL (Right Sidebar Column) */}
      <div className="w-full md:w-[320px] shrink-0 space-y-6">
        
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <h3 className="text-sm font-bold text-white mb-4 tracking-wide flex items-center space-x-2">
            <CheckSquare className="w-4.5 h-4.5 text-secondary" />
            <span>Question Palette</span>
          </h3>

          <div className="grid grid-cols-5 gap-2.5">
            {sectionQuestions.map((q, idx) => {
              const isAnswered = !!testAnswers[q._id];
              const isActive = idx === activeQuestionIndex;
              return (
                <button
                  key={q._id}
                  onClick={() => setActiveQuestionIndex(idx)}
                  className={`aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                    isActive 
                      ? 'bg-secondary text-darkBg font-black shadow-[0_0_10px_rgba(34,211,238,0.4)]' 
                      : isAnswered 
                        ? 'bg-accent/20 border border-accent/40 text-accent font-semibold' 
                        : 'bg-white/5 border border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/10'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 space-y-2">
            <div className="flex items-center space-x-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="w-3 h-3 rounded bg-secondary" />
              <span>Current Question</span>
            </div>
            <div className="flex items-center space-x-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="w-3 h-3 rounded bg-accent/20 border border-accent/40" />
              <span>Answered</span>
            </div>
            <div className="flex items-center space-x-2.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <div className="w-3 h-3 rounded bg-white/5 border border-white/5" />
              <span>Unanswered</span>
            </div>
          </div>
        </div>

        {/* Global End-Exam Actions */}
        <button
          onClick={() => setShowSubmitModal(true)}
          className="w-full py-3.5 bg-gradient-to-tr from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 border border-primary/30 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all"
        >
          Finish & Submit Exam
        </button>

      </div>

      {/* 7. CONFIRM SUBMIT MODAL DIALOG OVERLAY */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-darkBg/80 backdrop-blur-sm z-[999] flex items-center justify-center p-6">
          <div className="w-full max-w-md glass-panel p-8 rounded-3xl border border-white/10 text-center shadow-2xl relative">
            <AlertCircle className="w-16 h-16 text-secondary mx-auto mb-6 animate-pulse" />
            <h3 className="text-xl font-extrabold text-white">Complete Submission?</h3>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              You have answered <strong>{answeredCount}</strong> out of <strong>{totalTestQuestions}</strong> total questions. 
              Submitting now will finalize this attempt. You cannot modify answers after submission.
            </p>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 py-3.5 rounded-xl font-bold text-xs uppercase transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={triggerAutoSubmit}
                disabled={testLoading}
                className="flex-1 btn-glow text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-wide disabled:opacity-50"
              >
                {testLoading ? 'Submitting...' : 'Confirm Submission'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

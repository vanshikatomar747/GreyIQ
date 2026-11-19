import Test from '../models/Test.js';
import Question from '../models/Question.js';
import Response from '../models/Response.js';
import Report from '../models/Report.js';
import Certification from '../models/Certification.js';

// Helper to shuffle array
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get all tests list
export const getTests = async (req, res) => {
  try {
    const tests = await Test.find({ isActive: true });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get test questions (randomized and sanitized)
export const getTestQuestions = async (req, res) => {
  const { testId } = req.params;

  try {
    const test = await Test.findOne({ _id: testId, isActive: true });
    if (!test) {
      return res.status(404).json({ message: 'Test not found or is currently inactive' });
    }

    const questions = await Question.find({ testId });
    
    // Group questions by section
    const groupedQuestions = {};
    test.sections.forEach(sec => {
      groupedQuestions[sec.name] = [];
    });

    questions.forEach(q => {
      if (groupedQuestions[q.section]) {
        // Sanitize question: remove correct answer before sending
        groupedQuestions[q.section].push({
          _id: q._id,
          question: q.question,
          options: shuffleArray(q.options), // Randomized option order
          section: q.section
        });
      }
    });

    // Shuffle questions within each section dynamically
    Object.keys(groupedQuestions).forEach(section => {
      groupedQuestions[section] = shuffleArray(groupedQuestions[section]);
    });

    res.json({
      testId: test._id,
      title: test.title,
      sections: test.sections,
      questions: groupedQuestions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit test answers
export const submitTest = async (req, res) => {
  const { testId, answers, startedAt, completedAt } = req.body;
  const studentId = req.user._id;

  try {
    const test = await Test.findOne({ _id: testId, isActive: true });
    if (!test) {
      return res.status(404).json({ message: 'Test not found or is currently inactive' });
    }

    // Check if the student has already submitted this test to prevent duplicate scores
    const existingReport = await Report.findOne({ studentId });
    if (existingReport) {
      if (test.title.toLowerCase().includes('1') && existingReport.test1Analysis?.completedAt) {
        return res.status(400).json({ message: 'You have already submitted answers for Test 1' });
      }
      if (!test.title.toLowerCase().includes('1') && existingReport.test2Analysis?.completedAt) {
        return res.status(400).json({ message: 'You have already submitted answers for Test 2' });
      }
    }

    // Verify exam duration limit on server-side
    if (startedAt) {
      const startedTime = new Date(startedAt).getTime();
      const totalMinutes = test.sections.reduce((acc, s) => acc + (s.timerMinutes || 15), 0);
      const maxDurationMs = (totalMinutes + 5) * 60 * 1000; // sum of section minutes + 5 minutes grace buffer
      
      // Use client-supplied completedAt timestamp to evaluate elapsed duration.
      // This protects legitimate users from being rejected due to local vs server system clock skew.
      const completedTime = completedAt ? new Date(completedAt).getTime() : Date.now();
      const elapsedMs = completedTime - startedTime;

      if (elapsedMs > maxDurationMs) {
        return res.status(400).json({ message: 'Exam submission rejected: allowed duration exceeded' });
      }
    }

    // Fetch correct answers for grading
    const databaseQuestions = await Question.find({ testId });
    const questionMap = new Map(databaseQuestions.map(q => [q._id.toString(), q]));

    let totalScore = 0;
    const gradedAnswers = [];
    const sectionCounts = {}; // Total questions per section
    const sectionCorrectCounts = {}; // Correct answers per section

    // Initialize section trackers
    test.sections.forEach(sec => {
      sectionCounts[sec.name] = 0;
      sectionCorrectCounts[sec.name] = 0;
    });

    // Count questions per section from DB
    databaseQuestions.forEach(q => {
      if (sectionCounts[q.section] !== undefined) {
        sectionCounts[q.section]++;
      }
    });

    answers.forEach(ans => {
      const q = questionMap.get(ans.questionId);
      if (q) {
        const selectedOpt = ans.selectedOption || '';
        const isCorrect = selectedOpt && q.correctAnswer.trim().toLowerCase() === selectedOpt.trim().toLowerCase();
        if (isCorrect) {
          totalScore++;
          if (sectionCorrectCounts[q.section] !== undefined) {
            sectionCorrectCounts[q.section]++;
          }
        }
        gradedAnswers.push({
          questionId: q._id,
          selectedOption: selectedOpt,
          isCorrect: !!isCorrect,
          section: q.section
        });
      }
    });

    // Create Response
    const response = await Response.create({
      studentId,
      testId,
      answers: gradedAnswers,
      score: totalScore,
      sectionScores: sectionCorrectCounts,
      startedAt: startedAt ? new Date(startedAt) : new Date(),
      completedAt: completedAt ? new Date(completedAt) : new Date()
    });

    // Generate or update report analytics
    let report = await Report.findOne({ studentId });
    if (!report) {
      report = new Report({ studentId });
    }

    const accuracy = databaseQuestions.length > 0 ? (totalScore / databaseQuestions.length) * 100 : 0;
    const timeSpentSeconds = startedAt && completedAt ? Math.round((new Date(completedAt) - new Date(startedAt)) / 1000) : 120;

    // Generate Section Feedback
    const strongAreas = [];
    const weakAreas = [];
    const suggestedImprovements = [];

    test.sections.forEach(sec => {
      const totalInSec = sectionCounts[sec.name] || 1;
      const correctInSec = sectionCorrectCounts[sec.name] || 0;
      const pct = (correctInSec / totalInSec) * 100;

      if (pct >= 70) {
        strongAreas.push(sec.name);
      } else {
        weakAreas.push(sec.name);
        if (sec.name.toLowerCase().includes('english') || sec.name.toLowerCase().includes('communication')) {
          suggestedImprovements.push('Focus on sentence correction, vocabulary lists, and practice reading comprehension.');
        } else if (sec.name.toLowerCase().includes('resume') || sec.name.toLowerCase().includes('placement')) {
          suggestedImprovements.push('Update your resume with action verbs, use ATS keywords, and complete a GitHub portfolio projects review.');
        } else if (sec.name.toLowerCase().includes('career') || sec.name.toLowerCase().includes('counselling')) {
          suggestedImprovements.push('Conduct mock interview practice, research industry salary ranges, and participate in peer negotiations.');
        } else {
          suggestedImprovements.push(`Strengthen core concepts in ${sec.name} and attempt practice quizzes.`);
        }
      }
    });

    if (suggestedImprovements.length === 0) {
      suggestedImprovements.push('Excellent overall performance! Maintain your strengths by reviewing advanced mock papers.');
    }

    const analysisPayload = {
      score: totalScore,
      totalQuestions: databaseQuestions.length,
      accuracy,
      timeSpentSeconds,
      sectionScores: sectionCorrectCounts,
      sectionTotals: sectionCounts,
      strongAreas,
      weakAreas,
      suggestedImprovements,
      completedAt: new Date()
    };

    if (test.title.toLowerCase().includes('1')) {
      report.test1Analysis = analysisPayload;
    } else {
      report.test2Analysis = analysisPayload;
      
      // Calculate improvement metrics if Test 1 was completed
      if (report.test1Analysis && report.test1Analysis.score !== undefined) {
        const t1 = report.test1Analysis;
        const t2 = analysisPayload;

        const improvementPercentage = t1.score > 0 
          ? ((t2.score - t1.score) / t1.score) * 100 
          : t2.score * 10; // Fallback if Test 1 score was 0

        const getSectionScore = (scores, name) => {
          if (!scores) return 0;
          return (typeof scores.get === 'function' ? scores.get(name) : scores[name]) || 0;
        };

        const getSectionKeys = (scores) => {
          if (!scores) return [];
          return typeof scores.keys === 'function' ? Array.from(scores.keys()) : Object.keys(scores);
        };

        // Skill growth calculation
        const skillGrowth = {};
        const t1SectionKeys = getSectionKeys(t1.sectionScores);
        test.sections.forEach((sec, idx) => {
          const t1SecName = t1SectionKeys[idx];
          const t1SecScore = t1SecName ? getSectionScore(t1.sectionScores, t1SecName) : 0;
          const t2SecScore = getSectionScore(t2.sectionScores, sec.name);
          skillGrowth[sec.name] = t2SecScore - t1SecScore;
        });

        // Compute scores out of 100 dynamically using keyword mapping
        const findSectionByKeywords = (sections, keywords) => {
          return sections.find(sec => 
            keywords.some(kw => sec.name.toLowerCase().includes(kw))
          );
        };

        const commSection = findSectionByKeywords(test.sections, ['english', 'communication', 'grammar', 'verbal']);
        const resumeSection = findSectionByKeywords(test.sections, ['resume', 'portfolio', 'ats', 'cv']);
        const careerSection = findSectionByKeywords(test.sections, ['career', 'negotiation', 'interview', 'counselling', 'placement']);

        const finalCommSecName = commSection?.name || test.sections[0]?.name;
        const finalResumeSecName = resumeSection?.name || test.sections[1]?.name;
        const finalCareerSecName = careerSection?.name || test.sections[2]?.name;

        const communicationReadiness = Math.round(
          getSectionScore(t2.sectionScores, finalCommSecName) / (sectionCounts[finalCommSecName] || 1) * 100
        );
        const resumeReadiness = Math.round(
          getSectionScore(t2.sectionScores, finalResumeSecName) / (sectionCounts[finalResumeSecName] || 1) * 100
        );
        const careerPreparedness = Math.round(
          getSectionScore(t2.sectionScores, finalCareerSecName) / (sectionCounts[finalCareerSecName] || 1) * 100
        );

        const confidenceScore = Math.min(100, Math.round(60 + (improvementPercentage > 0 ? improvementPercentage * 1.5 : 5)));
        const placementReadinessScore = Math.round((communicationReadiness + resumeReadiness + careerPreparedness) / 3);
        const competitiveExamReadiness = Math.round(communicationReadiness * 0.9 + 10);
        const overallDevelopmentIndex = Math.round((placementReadinessScore + confidenceScore) / 2);

        // Personalized recommendations
        const recs = [];
        if (placementReadinessScore < 70) recs.push('Schedule a 1-on-1 session with our Placement Advisor to address resume gaps.');
        if (communicationReadiness < 70) recs.push('Participate in English debate workshops or daily vocabulary practice exercises.');
        if (resumeReadiness < 70) recs.push('Use the GreyIQ Solutions Builder to review ATS compatibility score and keywords density.');
        if (careerPreparedness < 70) recs.push('Join mock salary negotiations and industry awareness webinars.');
        if (recs.length === 0) recs.push('You are fully ready for core and product placements! Keep practicing advanced aptitude exams.');

        report.improvementMetrics = {
          improvementPercentage,
          skillGrowth,
          communicationReadiness,
          resumeReadiness,
          careerPreparedness,
          confidenceScore,
          placementReadinessScore,
          competitiveExamReadiness,
          overallDevelopmentIndex,
          personalizedRecommendations: recs
        };
      }
    }

    await report.save();

    res.json({
      message: 'Test submitted successfully',
      responseId: response._id,
      score: totalScore,
      accuracy,
      report
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// Get active student's report
export const getStudentReport = async (req, res) => {
  try {
    const report = await Report.findOne({ studentId: req.user._id });
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Apply for certification
export const applyForCertification = async (req, res) => {
  const { name, email, rollNo, collegeName } = req.body;
  const studentId = req.user._id;

  try {
    if (!name || !email || !rollNo || !collegeName) {
      return res.status(400).json({ message: 'All details are required' });
    }

    // Verify student has completed the requirements (Test 2 completed)
    const report = await Report.findOne({ studentId });
    if (!report || !report.test2Analysis?.completedAt) {
      return res.status(400).json({ message: 'You must complete the Career Readiness Index assessment (Test 2) before applying for certification.' });
    }

    const existing = await Certification.findOne({ studentId });
    if (existing) {
      return res.status(400).json({ message: 'You have already submitted an application for certification' });
    }

    const application = await Certification.create({
      studentId,
      name,
      email,
      rollNo,
      collegeName,
      status: 'pending'
    });

    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get certification application status
export const getCertificationStatus = async (req, res) => {
  const studentId = req.user._id;
  try {
    const application = await Certification.findOne({ studentId });
    res.json(application || null);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



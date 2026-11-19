import User from '../models/User.js';
import Test from '../models/Test.js';
import Question from '../models/Question.js';
import Response from '../models/Response.js';
import Report from '../models/Report.js';
import Certification from '../models/Certification.js';
import Contact from '../models/Contact.js';

// Question validation helper
const validateQuestionPayload = (payload) => {
  const { section, question, options, correctAnswer } = payload;
  if (!question || typeof question !== 'string' || !question.trim()) {
    throw new Error('Question text is required and cannot be empty.');
  }
  if (!section || typeof section !== 'string' || !section.trim()) {
    throw new Error('Section name is required and cannot be empty.');
  }
  if (!Array.isArray(options) || options.length !== 4) {
    throw new Error('Options must be an array of exactly 4 choices.');
  }
  const cleanOptions = options.map(o => {
    if (typeof o !== 'string' || !o.trim()) {
      throw new Error('All 4 options must be non-empty strings.');
    }
    return o.trim();
  });
  if (!correctAnswer || typeof correctAnswer !== 'string' || !correctAnswer.trim()) {
    throw new Error('Correct answer is required.');
  }
  const matchedOption = cleanOptions.find(o => o.toLowerCase() === correctAnswer.trim().toLowerCase());
  if (!matchedOption) {
    throw new Error('Correct answer must exactly match one of the 4 options.');
  }
  return {
    options: cleanOptions,
    correctAnswer: matchedOption
  };
};


// Get list of all students with their test status and reports
export const getStudents = async (req, res) => {
  try {
    const { search, filter } = req.query;
    
    // Find all users with role 'student'
    let query = { role: 'student' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await User.find(query).select('-password').lean();
    const studentIds = students.map(s => s._id);

    // Fetch test responses and reports
    const responses = await Response.find({ studentId: { $in: studentIds } }).lean();
    const reports = await Report.find({ studentId: { $in: studentIds } }).lean();

    // Map responses and reports to students
    const studentData = students.map(student => {
      const studentResponses = responses.filter(r => r.studentId.toString() === student._id.toString());
      const studentReport = reports.find(rep => rep.studentId.toString() === student._id.toString());
      
      const test1Attempt = studentResponses.find(r => r.score !== undefined); // Simple placeholder
      // For accurate grouping:
      return {
        ...student,
        attempts: studentResponses.length,
        scores: studentResponses.map(r => ({ testId: r.testId, score: r.score, completedAt: r.completedAt })),
        report: studentReport || null
      };
    });

    // Apply filtering based on attempt status if provided
    let filteredData = studentData;
    if (filter === 'completed_both') {
      filteredData = studentData.filter(s => s.report?.test1Analysis && s.report?.test2Analysis);
    } else if (filter === 'completed_one') {
      filteredData = studentData.filter(s => (s.report?.test1Analysis && !s.report?.test2Analysis) || (!s.report?.test1Analysis && s.report?.test2Analysis));
    } else if (filter === 'no_attempts') {
      filteredData = studentData.filter(s => s.attempts === 0);
    }

    res.json(filteredData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// CRUD Questions
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find({}).populate('testId', 'title');
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createQuestion = async (req, res) => {
  const { testId, section, question, options, correctAnswer } = req.body;

  try {
    const validated = validateQuestionPayload({ section, question, options, correctAnswer });
    const newQuestion = await Question.create({
      testId,
      section: validated.section || section,
      question,
      options: validated.options,
      correctAnswer: validated.correctAnswer
    });
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { testId, section, question, options, correctAnswer } = req.body;

  try {
    const validated = validateQuestionPayload({ section, question, options, correctAnswer });
    const updatedQuestion = await Question.findByIdAndUpdate(
      id,
      { testId, section: validated.section || section, question, options: validated.options, correctAnswer: validated.correctAnswer },
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bulk upload questions
export const bulkUploadQuestions = async (req, res) => {
  const { questions } = req.body; // Expects array of { testId, section, question, options, correctAnswer }

  try {
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Please provide an array of questions' });
    }

    // Load all tests to map sections dynamically
    const tests = await Test.find({});
    const testMap = new Map(tests.map(t => [t._id.toString(), t]));

    const processedQuestions = questions.map((q, idx) => {
      // Run custom validation helper for each row
      let validated;
      try {
        validated = validateQuestionPayload(q);
      } catch (err) {
        throw new Error(`Row ${idx + 1}: ${err.message}`);
      }

      const test = testMap.get(q.testId?.toString());
      if (!test) {
        throw new Error(`Row ${idx + 1}: Test with ID ${q.testId} not found`);
      }

      const validSectionNames = test.sections.map(s => s.name);
      let targetSection = q.section;

      // Check if section name matches case-sensitively, or needs mapping
      if (!validSectionNames.includes(targetSection)) {
        const matched = validSectionNames.find(sName => sName.trim().toLowerCase() === targetSection?.trim().toLowerCase());
        if (matched) {
          targetSection = matched;
        } else {
          // Dynamic section mapping by keyword matching
          const lowerTarget = targetSection?.trim().toLowerCase() || '';
          let matchedSec = null;
          if (lowerTarget.includes('english') || lowerTarget.includes('communication') || lowerTarget.includes('grammar') || lowerTarget.includes('verbal')) {
            matchedSec = test.sections.find(s => s.name.toLowerCase().includes('english') || s.name.toLowerCase().includes('communication') || s.name.toLowerCase().includes('grammar') || s.name.toLowerCase().includes('verbal'));
          } else if (lowerTarget.includes('resume') || lowerTarget.includes('portfolio') || lowerTarget.includes('ats') || lowerTarget.includes('cv')) {
            matchedSec = test.sections.find(s => s.name.toLowerCase().includes('resume') || s.name.toLowerCase().includes('portfolio') || s.name.toLowerCase().includes('ats') || s.name.toLowerCase().includes('cv'));
          } else if (lowerTarget.includes('career') || lowerTarget.includes('negotiation') || lowerTarget.includes('interview') || lowerTarget.includes('counselling') || lowerTarget.includes('placement')) {
            matchedSec = test.sections.find(s => s.name.toLowerCase().includes('career') || s.name.toLowerCase().includes('negotiation') || s.name.toLowerCase().includes('interview') || s.name.toLowerCase().includes('counselling') || s.name.toLowerCase().includes('placement'));
          }

          if (matchedSec) {
            targetSection = matchedSec.name;
          } else {
            targetSection = validSectionNames[0];
          }
        }
      }

      return {
        ...q,
        options: validated.options,
        correctAnswer: validated.correctAnswer,
        section: targetSection
      };
    });

    const insertedQuestions = await Question.insertMany(processedQuestions);
    res.status(201).json({
      message: `${insertedQuestions.length} questions uploaded successfully`,
      count: insertedQuestions.length
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update Test Timers and configurations
export const updateTestSettings = async (req, res) => {
  const { testId } = req.params;
  const { sections } = req.body; // Array of { name, timerMinutes }

  try {
    const updatedTest = await Test.findByIdAndUpdate(
      testId,
      { sections },
      { new: true, runValidators: true }
    );

    if (!updatedTest) {
      return res.status(404).json({ message: 'Test not found' });
    }

    res.json(updatedTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a student and their associated test responses and reports
export const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await User.findOne({ _id: id, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    await User.findByIdAndDelete(id);
    await Response.deleteMany({ studentId: id });
    await Report.deleteMany({ studentId: id });

    res.json({ message: 'Student and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new student user
export const createStudent = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Check if email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const newStudent = await User.create({
      name,
      email,
      password, // Will be hashed automatically by pre-save hook
      role: 'student'
    });

    // Strip password in response
    const studentResponse = {
      _id: newStudent._id,
      name: newStudent.name,
      email: newStudent.email,
      role: newStudent.role,
      createdAt: newStudent.createdAt
    };

    res.status(201).json(studentResponse);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all certification applications
export const getCertificationApplications = async (req, res) => {
  try {
    const applications = await Certification.find({}).populate('studentId', 'name email').sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update application status (approve/reject)
export const updateCertificationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const application = await Certification.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ message: `Application status updated to ${status}`, application });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a certification application
export const deleteCertification = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await Certification.findByIdAndDelete(id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Certification application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reset a student's test attempt so they can retake it
export const resetStudentTest = async (req, res) => {
  const { studentId } = req.params;
  const { testId } = req.body;

  try {
    const student = await User.findOne({ _id: studentId, role: 'student' });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }

    // 1. Delete Response document
    await Response.deleteMany({ studentId, testId });

    // 2. Delete any Certification applications for this student to maintain integrity
    await Certification.deleteMany({ studentId });

    // 3. Update Report document to clear analysis results
    const report = await Report.findOne({ studentId });
    if (report) {
      if (test.title.toLowerCase().includes('1')) {
        report.test1Analysis = undefined;
        report.improvementMetrics = undefined;
      } else {
        report.test2Analysis = undefined;
        report.improvementMetrics = undefined;
      }
      
      // If both analyses are cleared, delete the report document, otherwise save
      if (!report.test1Analysis && !report.test2Analysis) {
        await Report.findByIdAndDelete(report._id);
      } else {
        await report.save();
      }
    }

    res.json({ message: `Successfully reset ${test.title} for student ${student.name}.` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all support/contact messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a support/contact message by ID
export const deleteMessage = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Support message deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




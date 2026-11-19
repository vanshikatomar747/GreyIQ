import express from 'express';
import { 
  getStudents, 
  getQuestions, 
  createQuestion, 
  updateQuestion, 
  deleteQuestion, 
  bulkUploadQuestions, 
  updateTestSettings,
  deleteStudent,
  createStudent,
  getCertificationApplications,
  updateCertificationStatus,
  deleteCertification,
  resetStudentTest,
  getMessages,
  deleteMessage
} from '../controllers/adminController.js';
import { protect, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/students', getStudents);
router.post('/students', createStudent);
router.delete('/students/:id', deleteStudent);
router.get('/questions', getQuestions);
router.post('/questions', createQuestion);
router.put('/questions/:id', updateQuestion);
router.delete('/questions/:id', deleteQuestion);
router.post('/questions/bulk', bulkUploadQuestions);
router.put('/tests/:testId/settings', updateTestSettings);
router.get('/certifications', getCertificationApplications);
router.put('/certifications/:id', updateCertificationStatus);
router.delete('/certifications/:id', deleteCertification);
router.post('/students/:studentId/reset-test', resetStudentTest);
router.get('/messages', getMessages);
router.delete('/messages/:id', deleteMessage);

export default router;

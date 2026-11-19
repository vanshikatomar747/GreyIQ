import express from 'express';
import { getTests, getTestQuestions, submitTest, getStudentReport, applyForCertification, getCertificationStatus } from '../controllers/testController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getTests);
router.get('/report', getStudentReport);
router.get('/certifications/status', getCertificationStatus);
router.get('/:testId/questions', getTestQuestions);
router.post('/submit', submitTest);
router.post('/certifications', applyForCertification);


export default router;

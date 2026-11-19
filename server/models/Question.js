import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true, index: true },
  section: { type: String, required: true },
  question: { type: String, required: true },
  options: { type: [String], required: true },
  correctAnswer: { type: String, required: true }
}, {
  timestamps: true
});

const Question = mongoose.model('Question', questionSchema);
export default Question;

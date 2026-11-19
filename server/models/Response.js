import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  testId: { type: mongoose.Schema.Types.ObjectId, ref: 'Test', required: true, index: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      selectedOption: { type: String, default: '' },
      isCorrect: { type: Boolean, default: false },
      section: { type: String, required: true }
    }
  ],
  score: { type: Number, required: true },
  sectionScores: {
    type: Map,
    of: Number
  },
  startedAt: { type: Date },
  completedAt: { type: Date }
}, {
  timestamps: true
});

const Response = mongoose.model('Response', responseSchema);
export default Response;

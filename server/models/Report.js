import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  test1Analysis: {
    score: { type: Number },
    totalQuestions: { type: Number },
    accuracy: { type: Number },
    timeSpentSeconds: { type: Number },
    sectionScores: { type: Map, of: Number },
    sectionTotals: { type: Map, of: Number },
    strongAreas: { type: [String] },
    weakAreas: { type: [String] },
    suggestedImprovements: { type: [String] },
    completedAt: { type: Date }
  },
  test2Analysis: {
    score: { type: Number },
    totalQuestions: { type: Number },
    accuracy: { type: Number },
    timeSpentSeconds: { type: Number },
    sectionScores: { type: Map, of: Number },
    sectionTotals: { type: Map, of: Number },
    strongAreas: { type: [String] },
    weakAreas: { type: [String] },
    suggestedImprovements: { type: [String] },
    completedAt: { type: Date }
  },
  improvementMetrics: {
    improvementPercentage: { type: Number },
    skillGrowth: { type: Map, of: Number },
    communicationReadiness: { type: Number },
    resumeReadiness: { type: Number },
    careerPreparedness: { type: Number },
    confidenceScore: { type: Number },
    placementReadinessScore: { type: Number },
    competitiveExamReadiness: { type: Number },
    overallDevelopmentIndex: { type: Number },
    personalizedRecommendations: { type: [String] }
  }
}, {
  timestamps: true
});

const Report = mongoose.model('Report', reportSchema);
export default Report;

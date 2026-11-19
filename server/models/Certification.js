import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  rollNo: { type: String, required: true },
  collegeName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  appliedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const Certification = mongoose.model('Certification', certificationSchema);
export default Certification;

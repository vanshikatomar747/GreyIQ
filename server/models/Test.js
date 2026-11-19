import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  sections: [
    {
      name: { type: String, required: true },
      timerMinutes: { type: Number, required: true, default: 15 }
    }
  ],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

const Test = mongoose.model('Test', testSchema);
export default Test;

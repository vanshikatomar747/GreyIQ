import mongoose from 'mongoose';
import User from '../models/User.js';
import Test from '../models/Test.js';

export const connectDB = async () => {
  // Register runtime connection monitoring listeners
  mongoose.connection.on('error', err => {
    console.error('\x1b[31m%s\x1b[0m', `MongoDB Runtime Connection Error: ${err}`);
  });
  mongoose.connection.on('disconnected', () => {
    console.warn('\x1b[33m%s\x1b[0m', 'MongoDB connection lost! Mongoose will attempt automatic reconnection...');
  });
  mongoose.connection.on('reconnected', () => {
    console.log('\x1b[32m%s\x1b[0m', 'MongoDB connection successfully restored.');
  });

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greyiq');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Auto-create Test 1 and Test 2 configurations if they do not exist
    const test1Exists = await Test.findOne({ title: 'Test 1' });
    if (!test1Exists) {
      console.log('Test 1 configuration not found. Initializing template...');
      await Test.create({
        title: "Test 1",
        sections: [
          { name: "English Basics & Grammar", timerMinutes: 10 },
          { name: "Resume Foundations", timerMinutes: 10 },
          { name: "Career Awareness", timerMinutes: 10 }
        ]
      });
    }

    const test2Exists = await Test.findOne({ title: 'Test 2' });
    if (!test2Exists) {
      console.log('Test 2 configuration not found. Initializing template...');
      await Test.create({
        title: "Test 2",
        sections: [
          { name: "Advanced Grammar & Placement Prep", timerMinutes: 12 },
          { name: "Professional Portfolios & Resume ATS", timerMinutes: 12 },
          { name: "Placement Scenarios & Negotiation", timerMinutes: 12 }
        ]
      });
    }

    // Auto-create or synchronize Admin user from environment variables
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    if (adminEmail && adminPassword) {
      const normalizedEmail = adminEmail.trim().toLowerCase();
      const existingAdmin = await User.findOne({ email: normalizedEmail });
      if (!existingAdmin) {
        console.log(`Creating Admin user (${normalizedEmail}) from env variables...`);
        await User.create({
          name: process.env.ADMIN_NAME || 'GreyIQ Admin',
          email: normalizedEmail,
          password: adminPassword,
          role: 'admin'
        });
        console.log('Admin user initialized successfully.');
      } else {
        const isMatch = await existingAdmin.comparePassword(adminPassword);
        if (!isMatch || existingAdmin.role !== 'admin') {
          console.log(`Synchronizing Admin user (${normalizedEmail}) credentials...`);
          existingAdmin.password = adminPassword;
          existingAdmin.role = 'admin';
          await existingAdmin.save();
          console.log('Admin user synchronized successfully.');
        }
      }
    }
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

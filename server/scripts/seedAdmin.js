import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import User from '../models/User.js';

async function seedAdmin() {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greyiq';
  console.log(`Connecting to MongoDB at: ${mongoUri}`);

  await mongoose.connect(mongoUri);

  const adminEmail = (process.env.ADMIN_EMAIL || 'admin1@greyiq.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin1@4290';
  const adminName = process.env.ADMIN_NAME || 'GreyIQ Admin';

  let user = await User.findOne({ email: adminEmail });
  if (!user) {
    user = await User.create({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    console.log(`\x1b[32m✔ Successfully created new Admin account:\x1b[0m ${adminEmail}`);
  } else {
    user.name = adminName;
    user.password = adminPassword;
    user.role = 'admin';
    await user.save();
    console.log(`\x1b[32m✔ Successfully updated and synchronized Admin password for:\x1b[0m ${adminEmail}`);
  }

  // Print all registered admins
  const admins = await User.find({ role: 'admin' }).select('name email role');
  console.log('\nRegistered Admin/Teacher accounts in MongoDB:');
  admins.forEach((a, i) => console.log(`  ${i + 1}. Email: ${a.email} | Name: ${a.name} | Role: ${a.role}`));

  await mongoose.disconnect();
  console.log('\n----------------------------------------');
  console.log('You can now log into Teacher Portal with:');
  console.log(`  Email:    ${adminEmail}`);
  console.log(`  Password: ${adminPassword}`);
  console.log('----------------------------------------\n');
  process.exit(0);
}

seedAdmin().catch(err => {
  console.error('\x1b[31mSeed error:\x1b[0m', err.message);
  process.exit(1);
});


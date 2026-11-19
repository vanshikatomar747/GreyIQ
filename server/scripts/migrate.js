import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const SOURCE_URI = 'mongodb://127.0.0.1:27017/sophospath';
const TARGET_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/greyiq';

async function migrate() {
  if (SOURCE_URI === TARGET_URI) {
    console.error('Source and target database URIs are the same. Aborting migration.');
    process.exit(1);
  }

  console.log(`Connecting to source database: ${SOURCE_URI}`);
  const sourceConn = await mongoose.createConnection(SOURCE_URI).asPromise();
  console.log(`Connected to source successfully.`);

  console.log(`Connecting to target database: ${TARGET_URI}`);
  const targetConn = await mongoose.createConnection(TARGET_URI).asPromise();
  console.log(`Connected to target successfully.`);

  const collections = await sourceConn.db.listCollections().toArray();
  console.log(`Found ${collections.length} collections to migrate.`);
  
  for (const collectionInfo of collections) {
    const name = collectionInfo.name;
    // Skip system indexes/collections
    if (name.startsWith('system.')) continue;
    
    console.log(`Migrating collection: ${name}...`);
    
    const docs = await sourceConn.collection(name).find({}).toArray();
    console.log(`Found ${docs.length} documents in source ${name}.`);
    
    if (docs.length > 0) {
      // Clear target collection first to prevent duplication
      await targetConn.collection(name).deleteMany({});
      
      // Write all documents
      await targetConn.collection(name).insertMany(docs);
      console.log(`Successfully migrated ${docs.length} documents to target ${name}.`);
    } else {
      console.log(`Skipping empty collection: ${name}`);
    }
  }

  await sourceConn.close();
  await targetConn.close();
  console.log('\nMigration completed successfully!');
  process.exit(0);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

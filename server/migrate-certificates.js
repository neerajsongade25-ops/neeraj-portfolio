/**
 * migrate-certificates.js
 * One-time script: clears legacy local `certificateFile` paths from all
 * Achievement documents that don't yet have a Cloudinary URL.
 *
 * Run from the server/ directory:
 *   node migrate-certificates.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Achievement = require('./models/Achievement');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');

    // Find all achievements that have a legacy local certificateFile
    // but no Cloudinary certificateUrl yet
    const result = await Achievement.updateMany(
      {
        certificateFile: { $ne: null, $exists: true },
        $or: [
          { certificateUrl: null },
          { certificateUrl: { $exists: false } },
        ],
      },
      {
        $set: {
          certificateFile: null,
          certificateUrl: null,
          certificatePublicId: null,
          certificateResourceType: null,
        },
      }
    );

    console.log(`✅ Cleared legacy certificate data from ${result.modifiedCount} achievement(s).`);
    console.log('   You can now re-upload certificates from the Admin Dashboard.');
    console.log('   New uploads will be stored on Cloudinary and work in production.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected.');
  }
}

migrate();

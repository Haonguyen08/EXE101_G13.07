const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const resetPasswords = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pet_passport_db';
    await mongoose.connect(mongoUri);
    const hash = await bcrypt.hash('123456', 10);
    const result = await mongoose.connection.db.collection('accounts').updateMany(
      {},
      { $set: { passwordHash: hash } }
    );
    console.log(`Updated passwords for ${result.modifiedCount} accounts to: 123456`);
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error resetting passwords:', error);
    process.exit(1);
  }
};

resetPasswords();

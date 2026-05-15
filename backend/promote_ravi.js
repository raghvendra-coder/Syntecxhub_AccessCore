const mongoose = require('mongoose');
const User = require('./models/User.model');
require('dotenv').config();

const promoteUser = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/accesscore');
    console.log('Connected to MongoDB');
    
    const users = await User.find({}, 'name email role');
    console.log('Current Users:', users);
    
    const ravi = await User.findOne({ name: /Ravi/i });
    if (ravi) {
      ravi.role = 'admin';
      await ravi.save();
      console.log(`SUCCESS: User ${ravi.name} (${ravi.email}) promoted to ADMIN`);
    } else {
      console.log('ERROR: User Ravi not found');
    }
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

promoteUser();

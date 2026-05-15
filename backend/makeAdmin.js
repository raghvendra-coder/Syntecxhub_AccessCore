const mongoose = require('mongoose');
require('dotenv').config();
const User = require('./models/User.model.js'); // Assuming the model is named User.model.js

mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/accesscore')
  .then(async () => {
    console.log('Connected to DB');
    const result = await User.updateMany({}, { role: 'admin' });
    console.log(`Updated ${result.modifiedCount} users to admin role.`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });

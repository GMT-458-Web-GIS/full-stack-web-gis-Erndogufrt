const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Requirements 1: Managing Different User Types
  role: { 
    type: String, 
    enum: ['Sultan', 'Commander', 'Scout'], 
    default: 'Scout' 
  },
  score: { type: Number, default: 0 }
});

module.exports = mongoose.model('User', UserSchema);

const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const Schema = mongoose;

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  userId: {type: String, default: uuidv4 },  // Add unique userId
  accountStatus: { type: String, default: 'open' }, // Default account status
  cart: [{
    productId: { type: Schema.Types.ObjectId, ref: "Product" },  // Reference to product model
    quantity: { type: Number, default: 0 }  // Default quantity is 1
  }]
});

module.exports = mongoose.model('User', UserSchema);

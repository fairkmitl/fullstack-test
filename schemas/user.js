const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const UserSchema = new Schema({
  createdAt: { type: Date, default: new Date() },
  email: { type: String, lowercase: true, trim: true },
  updatedAt: { type: Date, default: new Date() },
  username: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

module.exports = User;

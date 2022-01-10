const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  photo: { type: String },
  name: { type: String },
  bio: { type: String },
  phone: { type: String },
  lastSignInDate: { type: Date },
});

module.exports = mongoose.model("User", userSchema);

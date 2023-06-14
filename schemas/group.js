const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const GroupSchema = new Schema({
  createdAt: { type: Date, default: new Date() },
  meta: {
    isPrivate: { type: Boolean, default: false },
  },
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["active", "deleted"],
  },
  updatedAt: { type: Date, default: new Date() },
});

const Group = mongoose.model("Group", GroupSchema);

module.exports = Group;

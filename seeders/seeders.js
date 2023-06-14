const mongoose = require("mongoose");
const User = require("../schemas/user");
const Group = require("../schemas/group");
const GroupUser = require("../schemas/group-user");
const { mongo } = require("../config");

// Establish a connection to MongoDB using Mongoose.
async function connectToDb() {
  try {
    await mongoose
      .connect(mongo.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("MongoDB connected..."))
      .catch((err) => console.error(`Could not connect to MongoDB: ${err}`));
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}

// Creates mock groups
async function createGroups() {
  const groupData = [
    { name: "Group 1", meta: { isPrivate: true } },
    { name: "Group 2", meta: { isPrivate: false } },
    { name: "Group 3", meta: { isPrivate: true } },
  ];

  for (let data of groupData) {
    const group = new Group(data);
    await group.save();
  }
}

// Creates mock users
async function createUsers() {
  const userData = [
    { username: "user1", email: "user1@email.com" },
    { username: "user2", email: "user2@email.com" },
    { username: "user3", email: "user3@email.com" },
  ];

  for (let data of userData) {
    const user = new User(data);
    await user.save();
  }
}

// Creates mock group-user associations
async function createGroupUsers() {
  const groups = await Group.find({}).lean();
  const users = await User.find({}).lean();

  const dates = [new Date("2021-11-01"), new Date("2021-10-01"), new Date("2022-01-01"), new Date("2020-11-01")];

  // Assume each user joins each group.
  for (let group of groups) {
    for (let user of users) {
      const groupUser = new GroupUser({
        groupId: group._id,
        userId: user._id,
        createdAt: dates[Math.floor(Math.random() * dates.length)],
      });
      await groupUser.save();
    }
  }
}

async function seedData() {
  await connectToDb(); // Ensure connection to the MongoDB
  await createGroups();
  await createUsers();
  await createGroupUsers();
  console.log("Data seeded successfully");
}

module.exports = {
  seedData,
};

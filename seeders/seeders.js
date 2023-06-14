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
  // Define the group data
  const groupData = [
    { name: "Group 1", meta: { isPrivate: true } },
    { name: "Group 2", meta: { isPrivate: false } },
    { name: "Group 3", meta: { isPrivate: true } },
  ];

  // Create groups based on the group data
  for (let data of groupData) {
    const group = new Group(data);
    await group.save();
  }
}

// Creates mock users
async function createUsers() {
  // Define the user data
  const userData = [
    { username: "user1", email: "user1@email.com" },
    { username: "user2", email: "user2@email.com" },
    { username: "user3", email: "user3@email.com" },
    { username: "user4", email: "user4@email.com" },
    { username: "user5", email: "user5@email.com" },
    { username: "user6", email: "user6@email.com" },
    { username: "user7", email: "user7@email.com" },
    { username: "user8", email: "user8@email.com" },
    { username: "user9", email: "user9@email.com" },
    { username: "user10", email: "user10@email.com" },
  ];

  const startDate = new Date("2021-10-01");
  const endDate = new Date("2021-10-31");

  // Create users based on the user data
  for (let data of userData) {
    const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
    const user = new User({ ...data, createdAt: randomDate });
    await user.save();
  }
}

// Creates mock group-user associations
async function createGroupUsers() {
  const groups = await Group.find({}).lean();
  const users = await User.find({}).lean();

  // Define the possible join dates
  const dates = [new Date("2021-11-01"), new Date("2021-11-30"), new Date("2021-10-01"), new Date("2022-01-01"), new Date("2020-11-01")];

  // Create group-user associations based on the groups, users, and join dates
  for (let group of groups) {
    for (let user of users) {
      const groupUser = new GroupUser({
        groupId: group._id,
        userId: user._id,
        createdAt: dates[Math.floor(Math.random() * dates.length)], // Random user joined date
      });
      await groupUser.save();
    }
  }
}

// Seed the data
async function seedData() {
  await connectToDb(); // Ensure connection to the MongoDB
  await createGroups();
  await createUsers();
  await createGroupUsers();
  console.log("Data seeded successfully");
  process.exit(0); // Exit the process
}

module.exports = {
  seedData,
};

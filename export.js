const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const mongoose = require("mongoose");
const User = require("./schemas/user");
const Group = require("./schemas/group");
const GroupUser = require("./schemas/group-user");
const { mongo } = require("./config");

// Establish a connection to MongoDB using Mongoose.
async function connectToDb() {
  try {
    await mongoose
      .connect(mongo.URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => console.log("MongoDB connected...")) // Connection successful
      .catch((err) => console.error(`Could not connect to MongoDB: ${err}`));
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}

async function exportData() {
  await connectToDb();

  const start = new Date("2021-11-01"); // Start date for filtering
  const end = new Date("2021-12-01"); // End date for filtering

  const groups = await Group.find({ "meta.isPrivate": true }).lean(); // Find private groups

  let records = [];

  for (const group of groups) {
    const groupUsers = await GroupUser.find({
      groupId: group._id,
      createdAt: { $gte: start, $lt: end }, // Filter users who joined in November 2021
    })
      .populate({
        path: "userId",
        select: "username email",
        model: User,
      })
      .lean();

    for (const groupUser of groupUsers) {
      const { username, email } = groupUser.userId;
      records.push({
        groupName: group.name,
        username,
        email,
        privateGroup: group.meta.isPrivate ? "true" : "false", // Indicate if the group is private
        joinedDate: groupUser.createdAt.toISOString().split("T")[0], // Format the joined date as YYYY-MM-DD
      });
    }
  }

  records.sort((a, b) => {
    const groupNameComparison = a.groupName.localeCompare(b.groupName); // Sort by group name ascending
    if (groupNameComparison === 0) {
      return a.username.localeCompare(b.username); // If group names are the same, sort by username ascending
    }
    return groupNameComparison;
  });

  const csvWriter = createCsvWriter({
    path: "output.csv", // Output file path
    header: [
      { id: "groupName", title: "Group Name" },
      { id: "username", title: "Username" },
      { id: "email", title: "Email" },
      { id: "privateGroup", title: "Private Group" },
      { id: "joinedDate", title: "Joined Date" },
    ],
  });

  csvWriter
    .writeRecords(records)
    .then(() => {
      console.log("Data exported successfully to output.csv");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error exporting data", err);
      process.exit(1);
    });
}

exportData();

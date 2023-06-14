const mongoose = require("mongoose");
const User = require("./schemas/user");
const { mongo } = require("./config");

// Establish a connection to MongoDB using Mongoose
async function connectToDb() {
  try {
    await mongoose.connect(mongo.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
  }
}

// Update all users by capitalizing the first letter of their usernames
async function updateUsers() {
  await connectToDb();

  try {
    const users = await User.find({});
    for (const user of users) {
      const username = user.username;
      const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1); // Uppercase transform for first letter
      user.username = capitalizedUsername;
      await user.save();
    }
    console.log("Users updated successfully");
  } catch (err) {
    console.error("Error updating users", err);
  }

  mongoose.connection.close();
}

// Call the function to update the users
updateUsers();

const mongoose = require("mongoose");
const { mongo } = require("./config");

// Establish a connection to MongoDB using Mongoose.
mongoose
  .connect(mongo.URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.error(`Could not connect to MongoDB: ${err}`));

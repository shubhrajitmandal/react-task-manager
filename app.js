const express = require("express");
// const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dontenv = require("dotenv");

dontenv.config();

const PORT = process.env.PORT || 8000;

// Import Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const taskRoutes = require("./routes/task");

mongoose.connect(
  process.env.DB_CONNECTION,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log("[+]Database Connected....")
);

// MIDDLEWARES
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(PORT, () => console.log(`[+]Server listening on port ${PORT}....`));

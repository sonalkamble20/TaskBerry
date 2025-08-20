const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// serve your frontend
app.use(express.static(path.join(__dirname, "public")));

// routes
const userRoutes = require("./server/routes/user");
const jobRoutes = require("./server/routes/job");
app.use("/user", userRoutes);
app.use("/job", jobRoutes);

// start
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

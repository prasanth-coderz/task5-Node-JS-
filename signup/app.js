// THIS FILE IS USED TO CREATE & RUN LOCAL SERVER (PORT:3100)

const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const { sequelize } = require("./dbservices/dbqueries");
const authRoutes = require("./routes/route-file");

const app = express();
const port = 3100;

app.use(express.json());

// Routes
app.use("/auth", authRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

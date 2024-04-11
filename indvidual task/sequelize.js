const express = require("express");
const { Sequelize, DataTypes } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = 3306;
app.use(express.json());

// DATABASE CONNECTION WITH DOTENV FILE
const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.DB_HOST,
  port: process.env.PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// DATABASE CONNECTION
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// TABLE CREATION
const Users = sequelize.define("users", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gender: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  mail_id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

sequelize
  .sync()
  .then(() => {
    console.log("Tables created successfully.");
  })
  .catch((err) => {
    console.error("Error creating table:", err);
  });

// CREATING NEW RECORDS AS ADDING USERS
app.post("/adduser", async (req, res) => {
  try {
    const { name, gender, mail_id, age } = req.body;
    const newUser = await Users.create({ name, gender, mail_id, age });
    res
      .status(200)
      .json({ message: "Data added successfully", id: newUser.id });
  } catch (err) {
    console.error("Error adding user:", err);
    res.status(500).json({ error: "Error adding user" });
  }
});

// UPDATING USER FOR EXISTING RECORD
app.put("/updateuser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gender, mail_id, age } = req.body;

    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await user.update({ name, gender, mail_id, age });

    res.status(200).json({ message: "Data updated successfully" });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: "Error updating user" });
  }
});

// DELETE A USER
app.delete("/deleteuser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Error deleting the user" });
  }
});

// Get all users
app.get("/getusers", async (req, res) => {
  try {
    const users = await Users.findAll(); // Corrected line
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Error fetching users" });
  }
});

// Get a user by ID
app.get("/getuser/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id); // Corrected line
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Error fetching user" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

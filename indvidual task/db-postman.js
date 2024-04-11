const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mysql = require("mysql");
const app = express();
const port = 3005;

app.use(express.json());

// MySQL connection configuration
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.log("Error in connecting db:", err);
    return;
  }
  console.log("Connection is established");
});

const sql = `CREATE TABLE IF NOT EXISTS postman (
    id INT AUTO_INCREMENT PRIMARY KEY,
    NAME VARCHAR(50) NOT NULL,
    GENDER CHAR(1),
    MAIL_ID VARCHAR(50) NOT NULL UNIQUE
)`;

db.query(sql, (err, result) => {
  if (err) {
    console.log("Sorry can't create table:", err);
    return;
  }
  console.log("Table created successfully:", db.threadId);
});

// Add data using POST METHOD
app.post("/adduser", (req, res) => {
  const { name, gender, mail_id } = req.body;

  if (!name || !gender || !mail_id) {
    return res.status(400).json({ error: "Missing required data" });
  }

  const insertSql = `INSERT INTO postman (NAME, GENDER, MAIL_ID) VALUES (?, ?, ?)`;

  db.query(insertSql, [name, gender, mail_id], (err, result) => {
    if (err) {
      console.log("Error on adding the values:", err);
      return res.status(500).json({ error: "Error on adding data" });
    }
    console.log("Data added:", result);
    res
      .status(200)
      .json({ message: "Data added successfully", id: result.insertId });
  });
});

//Update user by PUT METHOD
app.put("/updateuser/:id", (req, res) => {
  const { id } = req.params;
  const { name, gender, mail_id } = req.body;

  if (!name || !gender || !mail_id) {
    return res.status(400).json({ error: "Missing required data" });
  }

  const updateSql = `UPDATE postman SET NAME = ?, GENDER = ?, MAIL_ID = ? WHERE id = ?`;

  db.query(updateSql, [name, gender, mail_id, id], (err, result) => {
    if (err) {
      console.log("Error updating data:", err);
      return res.status(500).json({ error: "Error updating data" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Data updated successfully" });
  });
});

// Delete a user by DELETE METHOD
app.delete("/deleteuser/:id", (req, res) => {
  const { id } = req.params;
  const deleteSql = `DELETE FROM postman WHERE id = ?`;

  db.query(deleteSql, [id], (err, result) => {
    if (err) {
      console.log("Error deleting data:", err);
      return res.status(500).json({ error: "Error deleting data" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ message: "Data deleted successfully" });
  });
});

// Get all users using GET method
app.get("/getusers", (req, res) => {
  const selectSql = `SELECT * FROM postman`;

  db.query(selectSql, (err, result) => {
    if (err) {
      console.log("Error fetching data:", err);
      return res.status(500).json({ error: "Error fetching data" });
    }
    res.status(200).json(result);
  });
});

// Get a single user detials
app.get("/getuser/:id", (req, res) => {
  const { id } = req.params;
  const selectSql = `SELECT * FROM postman WHERE id = ?`;

  db.query(selectSql, [id], (err, result) => {
    if (err) {
      console.log("Error fetching data:", err);
      return res.status(500).json({ error: "Error fetching data" });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(result[0]);
  });
});

//SERVER PORT
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

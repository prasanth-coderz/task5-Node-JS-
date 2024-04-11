// ALL LOGIC OF API IS CREATED

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Customer } = require("../dbservices/dbqueries");
const { Op } = require("sequelize");
const { startOfDay, endOfDay } = require("date-fns");

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate username format (reject if it contains special characters)
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      return res
        .status(400)
        .json({ error: "Username should not contain special characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Customer.create({
      username,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Error registering user" });
  }
};
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if all required fields are provided
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Validate username format (reject if it contains special characters)
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if (!usernameRegex.test(username)) {
      return res
        .status(400)
        .json({ error: "Username should not contain special characters" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Customer.create({
      username,
      email,
      password: hashedPassword,
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", userId: newUser.id });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Error registering user" });
  }
};

exports.login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    if (!usernameOrEmail || !password) {
      console.error("Missing fields:", { usernameOrEmail, password });
      return res
        .status(400)
        .json({ error: "Username/ mail and password are required" });
    }

    const user = await Customer.findOne({
      where: {
        [Op.or]: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Generate and send JWT token
    const accessToken = jwt.sign(
      { username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // JWT TOKEN WILL EXPIRE AFTER 1 HOUR
    );

    return res.status(200).json({ message: "Login successful", accessToken });
  } catch (error) {
    console.error("Error logging in:", error);
    return res
      .status(500)
      .json({ error: "Error logging in", details: error.message });
  }
};

exports.changePassword = async (req, res) => {
  const { username, oldpwd, newpwd } = req.body;

  try {
    if (!username || !oldpwd || !newpwd) {
      return res
        .status(400)
        .json({ error: "Need all details to update password" });
    }

    const user = await Customer.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const ispwdvalid = await bcrypt.compare(oldpwd, user.password);
    if (!ispwdvalid) {
      return res.status(401).json({ error: "Old password is incorrect" });
    }

    const hashednewpwd = await bcrypt.hash(newpwd, 10);
    user.password = hashednewpwd;
    await user.save();

    return res.status(200).json({ message: "New password changed" });
  } catch (error) {
    console.error("Error while changing pwd:", error);
    return res.status(500).json({ error: "Error while changing password" });
  }
};

exports.customerList = async (req, res) => {
  const { from, till, sortBy, orderby } = req.query;
  const { filter } = req.body;

  const pageNumber = parseInt(from) || 1;
  const limitNumber = parseInt(till) || 10;

  // Define the sort mapping object
  const sortMapping = {
    id: [["id", orderby]],
    name: [["username", orderby]],
    email: [["email", orderby]],
  };

  // Check if the sort field is valid
  let sortField = sortMapping[sortBy] || null;

  let whereClause = {};

  try {
    const offset = (pageNumber - 1) * limitNumber;

    const options = {
      limit: limitNumber,
      offset: offset,
      order: sortField,
    };

    // Parse the filter object
    if (filter) {
      const filterObj = filter;

      Object.keys(filterObj).forEach((key) => {
        const term = filterObj[key];

        const filterConditions = {
          id: { [Op.like]: `%${term}%` },
          username: { [Op.like]: `%${term}%` },
          email: { [Op.like]: `%${term}%` },
          createdAt: {},
        };

        if (key === "createdAt") {
          const specifiedDate = new Date(term);
          const startOfSpecifiedDate = startOfDay(specifiedDate);
          const endOfSpecifiedDate = endOfDay(specifiedDate);

          filterConditions.createdAt = {
            [Op.between]: [startOfSpecifiedDate, endOfSpecifiedDate],
          };
        } else {
          filterConditions[key] = { [Op.like]: `%${term}%` };
        }

        if (filterConditions[key]) {
          whereClause[key] = filterConditions[key];
        }
      });

      if (Object.keys(whereClause).length > 0) {
        options.where = whereClause;
      }
    }

    const customers = await Customer.findAndCountAll(options);

    res.status(200).json({
      totalItems: customers.count,
      data: customers.rows,
    });
  } catch (error) {
    console.error("Error fetching customers:", error);
    res
      .status(500)
      .json({ error: "Error fetching customers", details: error.message });
  }
};

let users = {};

const getHomePage = (req, res) => {
  res.send("Welcome to the Home Page");
};

const getAboutPage = (req, res) => {
  res.send("About Page");
};

const getAllUsers = (req, res) => {
  try {
    let userList = Object.values(users);

    // QUERY PARAMS FOR SORTING
    if (req.query.sortBy) {
      userList = userList.sort((a, b) => {
        if (a[req.query.sortBy] < b[req.query.sortBy]) return -1;
        if (a[req.query.sortBy] > b[req.query.sortBy]) return 1;
        return 0;
      });
    }

    res.status(200).json(userList);
  } catch (error) {
    res.status(500) .json({ message: "Error fetching users", error: error.message });
  }
};

const getUserById = (req, res) => {
  try {
    const user = users[req.params.id];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};

const createUser = (req, res) => {
  try {
    const { id } = req.params; 
    const { name, email, age } = req.body; // BODY PARAMS

    if (!id || !name || !email || !age) {
      return res.status(400).json({ message: "ID, name, email, and age are required" });
    }

    const newUser = {
      id: id, 
      name: name,
      email: email,
      age: age, 
    };

    users[id] = newUser; 

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};


const updateUserById = (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    if (!id || !name || !email || !age) {
      return res.status(400).json({ message: "ID, name, email, and age are required" });
    }

    const user = users[id];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name;
    user.email = email;
    user.age = age;

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

const deleteUserById = (req, res) => {
  try {
    const { id } = req.params;
    
    const user = users[id];

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    delete users[id];

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};

module.exports = {
  getHomePage,
  getAboutPage,
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUserById,
};

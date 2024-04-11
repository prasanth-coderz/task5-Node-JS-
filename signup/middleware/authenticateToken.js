// USES AS MIDDLEWARE TO TO AUTH TOKEN FOR LOGIN USERS

const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err);
      return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

module.exports = authenticateToken;

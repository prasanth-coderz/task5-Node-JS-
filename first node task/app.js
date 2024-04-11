const express = require("express");
const app = express();
const port = 3000;

// Import route modules
const routes = require("../routes/routes");

// Use route modules
app.use("/", routes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


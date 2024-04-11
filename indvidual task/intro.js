// USING NODE JS (WITHOUT EXPRESS)
// const http = require("http");

// function rqlistener(req, res) {
//   const url = req.url;
//   if (url === "/aboutus") {
//     res.setHeader("Content-type", "text/html");
//     res.write("<html>");
//     res.write("<title>About Us</title>");
//     res.write("<body><h1>About us page will be displayed here.</h1></body>");
//     res.write("</html>");
//     return res.end();
//   }

//   res.setHeader("Content-type", "text/html");
//   res.write("<html>");
//   res.write("<title>Node JS</title>");
//   res.write("<body><h1>Hello World!</h1></body>");
//   res.write("</html>");
//   res.end();

//   //   console.log(req.headers);
//   //   process.exit();
// }
// const server = http.createServer(rqlistener);
// server.listen(3008);

// BY USING EXPRESS
// const express = require("express");

// const app = express();
// const port = 3000;

// app.get("/", (req, res) => {
//   res.send("<h1>Hello, World!</h1>");
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

// ROUTING USING EXPRESS
const express = require("express");
const app = express();
const port = 3000;

// Define a route for the root URL using GET method
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Define a route for '/about' using GET method
app.get("/about", (req, res) => {
  res.send("About Us");
});

// Define a route for '/contact' using POST method
app.post("/contact", (req, res) => {
  res.send("Contact Us");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});


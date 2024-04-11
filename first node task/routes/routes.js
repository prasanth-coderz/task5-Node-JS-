const express = require("express");
const router = express.Router();
const controller = require("../controller/controller");
const { routerMiddleWare, checking } = require("../first node task/middleware/middleware"); // Import middleware functions

router.use(express.json());
router.use(routerMiddleWare()); // Use routerMiddleWare middleware

//GET METHOD
router.get("/", controller.getHomePage);
router.get("/about", checking("/about"), controller.getAboutPage);
router.get("/users", controller.getAllUsers);
router.get("/users/:id", controller.getUserById);

// POST METHOD to create a new user
router.post("/users/:id", controller.createUser);

//DELETE METHOD
router.delete("/users/:id", controller.deleteUserById);

//UPDATE METHOD
router.put("/users/:id", controller.updateUserById);

module.exports = router;

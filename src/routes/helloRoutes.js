const express = require("express");
const router = express.Router();
const helloController = require("../controllers/helloController");

// GET: Return a "Hello" message
router.get("/", helloController.sayHello);

module.exports = router;
module.exports = (app) => {
  const users = require("../controllers/user.controller.js");

  var router = require("express").Router();

  // Create a new Tutorial
  router.post("/signUp", users.create);

  // Retrieve all
  router.get("/", users.findAll);

  // Update  with id
  router.put("/:id", users.update);

  // Delete a Tutorial with id
  router.delete("/:id", users.delete);

  app.use("/api/users", router);
};

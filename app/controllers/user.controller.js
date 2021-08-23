const db = require("../models");
const Joi = require("joi");

const User = db.users;

// Create and Save a new Tutorial
exports.create = (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error);
  const user = new User(value);
  user
    .save()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the User.",
      });
    });
};

// Retrieve all Tutorials from the database.
exports.findAll = (req, res) => {
  var condition = {};
  if (req.query.firstName)
    condition.firstName = {
      $regex: new RegExp(req.query.firstName),
      $options: "i",
    };
  if (req.query.lastName)
    condition.firstName = {
      $regex: new RegExp(req.query.firstName),
      $options: "i",
    };

  User.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving user.",
      });
    });
};

// Find a single Tutorial with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Tutorial.findById(id)
    .then((data) => {
      if (!data)
        res.status(404).send({ message: "Not found Tutorial with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Tutorial with id=" + id });
    });
};

// Update a Tutorial by the id in the request
exports.update = (req, res) => {
  const { error, value } = validate(req.body);
  if (error) return res.status(400).send(error);

  const id = req.params.id;

  User.findByIdAndUpdate(id, value, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `User does not exist.`,
        });
      } else res.send({ message: "User updated successfully." });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete a Tutorial with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `User does not exist.`,
        });
      } else {
        res.send({
          message: "User deleted successfully.",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};

validate = (body) => {
  const schema = Joi.object({
    firstName: Joi.string().alphanum().min(3).max(30).required(),
    lastName: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string()
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
  });

  return schema.validate(body);
};

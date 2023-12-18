const express = require("express");
const router = express.Router();
const employeesController = require("../../controllers/employeesController");
const verifyRoles = require("../../middleware/verifyRoles");
const ROLES_LIST = require("../../config/roles_list");

router
  .route("/")
  .get(employeesController.getAllEmployees)
  .post(
    verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),
    employeesController.createNewEmployee
  );

module.exports = router;

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
  )
  .put(
    verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin),
    employeesController.updateEmployee
  )
  .delete(verifyRoles(ROLES_LIST.Admin), employeesController.deleteEmployee);

router.get("/:id", employeesController.getEmployee);

module.exports = router;

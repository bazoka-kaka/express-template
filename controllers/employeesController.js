const employeesDB = {
  employees: require("../db/employees.json"),
  setEmployees: function (data) {
    this.employees = data;
  },
};

const fsPromises = require("fs").promises;
const path = require("path");

const getAllEmployees = (req, res) => {
  res.json(employeesDB.employees);
};

const createNewEmployee = async (req, res) => {
  const { name, age } = req.body;
  if (!name || !age)
    return res.status(400).json({ message: "Name and age are required" });

  const newEmployee = {
    id: employeesDB.employees[employeesDB.employees.length - 1]?.id + 1 || 1,
    name,
    age,
  };

  // save new employee
  employeesDB.setEmployees([...employeesDB.employees, newEmployee]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "db", "employees.json"),
    JSON.stringify(employeesDB.employees)
  );

  res
    .status(201)
    .json({ message: `Employee ${name} is created successfully!` });
};

module.exports = { getAllEmployees, createNewEmployee };

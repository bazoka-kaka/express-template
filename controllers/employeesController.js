const Employee = require("../db/Employee");

const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find().exec();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createNewEmployee = async (req, res) => {
  const { name, age } = req.body;
  if (!name || !age)
    return res.status(400).json({ message: "Name and age are required" });

  const newEmployee = {
    name,
    age,
  };

  // save new employee
  try {
    const result = await Employee.create(newEmployee);

    console.log(result);

    res
      .status(201)
      .json({ message: `Employee ${name} is created successfully!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateEmployee = async (req, res) => {
  const { id, name, age } = req.body;
  if (!id) return res.status(400).json({ message: "ID is required" });

  try {
    const foundEmployee = await Employee.findById(id).exec();
    if (!foundEmployee)
      return res.status(400).json({ message: "Employee is not found" });

    if (name) foundEmployee.name = name;
    if (age) foundEmployee.age = age;

    const result = await foundEmployee.save();

    console.log(result);

    res.json({ message: `Employee ${id} is updated successfully!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteEmployee = async (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ message: "ID is required" });

  try {
    const foundEmployee = await Employee.findById(id).exec();
    if (!foundEmployee)
      return res.status(400).json({ message: "Employee is not found" });

    const result = await foundEmployee.deleteOne();

    console.log(result);

    res.json({ message: `Employee ${id} is deleted successfully!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getEmployee = async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({ message: "ID parameter is required" });
  try {
    const employee = await Employee.findById(req.params.id).exec();
    if (!employee)
      return res.status(400).json({ message: "Employee is not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllEmployees,
  createNewEmployee,
  updateEmployee,
  deleteEmployee,
  getEmployee,
};

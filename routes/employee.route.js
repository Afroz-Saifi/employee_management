const express = require("express");
const { Employee } = require("../models/employee.model");

const employeeRouter = express.Router();

// add new employee
employeeRouter.post("/employees", async (req, res) => {
  try {
    const { email, id } = req.user;
    const payload = req.body;
    const data = new Employee(payload);
    await data.save();
    return res.status(201).json({
      error: false,
      message: "Employee added successfully",
      employee: data,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});

// get all employees
employeeRouter.get("/employees", async (req, res) => {
  try {
    const {page, department, salary, first_name} = req.query;
    let skipPages = page ? (page-1)*5 : 0

    let filters = {}
    let sortMe = {}

    if(department && department != "false"){
      filters.department = department
    }

    if(salary && salary != "false"){
      sortMe.salary = salary
    }
    if(first_name && first_name != "false"){
      filters.first_name = first_name
    }

    console.log(sortMe);

    const data = await Employee.find(filters).skip(skipPages).limit(page ? 5 : 0).sort(sortMe);
    if (data.length == 0) {
      throw new Error("No employees found");
      return;
    }
    return res.status(200).json({
      error: false,
      data,
    });
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});

// edit employee
employeeRouter.patch("/employees/:id", async (req, res) => {
  try {
    const payload = req.body;
    const { id } = req.params;
    const data = await Employee.findByIdAndUpdate(id, payload);
    if(!data){
        throw new Error("Employee not found");
        return;
    }
    return res.status(201).json({
        error: false,
        message: "Employee edit success",
        edits: payload
    })
  } catch (error) {
    return res.status(400).json({
      error: true,
      message: error.message,
    });
  }
});

// delete employee
employeeRouter.delete("/employees/:id", async (req, res) => {
    try {
        const {id} = req.params;
        const data = await Employee.findByIdAndDelete(id)
        if(!data){
            throw new Error("server error !")
            return;
        }
        return res.status(202).json({
            error: false,
            message: "employee deleted success fully",
            employee: data
        })
    } catch (error) {
        return res.status(400).json({
            error: true,
            message: error.message,
          });
    }
})

module.exports = { employeeRouter };

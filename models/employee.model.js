const mongoose = require("mongoose");

const employee_schema = new mongoose.Schema({
  first_name: {
    type: String
  },
  last_name: {
    type: String
  },
  email: {
    type: String,
    require: true,
    unique: true
  },
  department: {
    type: String,
    enum: ["Tech", "Marketing", "Operations"],
    required: true,
  },
  salary: {
    type: Number
  }
});

const Employee = mongoose.model("employee", employee_schema);

module.exports = { Employee };

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connectDB } = require("./config/db");
const { userRouter } = require("./routes/user.route");
const { authentication } = require("./middleware/auth");
const { employeeRouter } = require("./routes/employee.route");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/user", userRouter);
app.use(authentication);
app.use("/employee", employeeRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connectDB;
    console.log("connected to db");
    console.log(`server running on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error.message);
  }
});

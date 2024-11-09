const express = require("express");
const dotenv = require("dotenv");
const { connectDb, globalErrorHandler } = require("./utils");
const morgan = require("morgan");

const { userRouter } = require("./routes");
// load environements variables
dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8080;

process.env.NODE_ENV === "development" && app.use(morgan("dev"));

app.use("/api/v1/users", userRouter);

app.use("*", globalErrorHandler);

app.listen(PORT, async () => {
  await connectDb();
  console.log(`server started at port : ${PORT}`);
});

const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
const account = require("./router/account");

app.use("/", account);
const connection =
  "mongodb+srv://admin:114514@cluster0.imyvizw.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(
  connection,
  {
    useNewUrlParser: true,
  },
  () => {
    console.log("mongoose连接成功了！");
    app.listen(27017, () => {
      console.log("app listening on port 27017.");
    });
  }
);
mongoose.connection.on("error", console.error);

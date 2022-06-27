const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
const mongoose = require("mongoose");
const cors = require("cors");
app.use(cors());
const account = require("./router/account");

app.use("/", account);

mongoose.connect(
  "mongodb://localhost:27017/myAccount",
  { useNewUrlParser: true },
  function (err) {
    if (err) {
      console.log("数据库连接失败");
    } else {
      console.log("数据库连接成功");
      // 监听http请求
      app.listen(27017, () => {
        console.log("app listening on port 27017.");
      });
    }
  }
);

const express = require("express");
const router = express.Router();
const Account = require("../models/account");

// 查询
router.get("/account/getHistory", (req, res) => {
  Account.find((err, data) => {
    if (err) {
      console.log(err);
    }
    res.json({
      status: 200,
      msg: "查询成功",
      data: data,
    });
  });
});

// 普通查询
// router.get("/account/:name", (req, res) => {
//   const dataName = req.params.name;
//   Account.find({ name: dataName }, (err, data) => {
//     if (err) {
//       console.log(err);
//     }
//     res.json({
//       status: 200,
//       msg: "查询成功",
//       data: data,
//     });
//   });
// });

// 模糊查询
router.get("/account/:name", (req, res) => {
  var whereStr = { name: { $regex: req.params.name } };
  Account.find(whereStr, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json({
      status: 200,
      msg: "查询成功",
      data: data,
    });
  });
});

// 添加
router.post("/account/add", (req, res) => {
  //   const body = req.query;
  Account.create(req.body, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json({
      status: 200,
      msg: "创建成功",
      data: data,
    });
  });
});

//更新
router.put("/account/:id", (req, res) => {
  const dataId = req.params.id;
  Account.findOneAndUpdate(
    { _id: dataId }, //查询条件
    {
      $set: {
        name: req.body.name,
        amount: req.body.amount,
        amountType: req.body.amountType,
        showAmount: req.body.showAmount,
        date: req.body.date,
      },
    }, //更改内容
    (err, data) => {
      if (err) {
        console.log(err);
      }
      res.json({
        status: 200,
        msg: "更改成功",
        result: data,
      });
    }
  );
});

//删除
router.delete("/account/:id", (req, res) => {
  var dataId = req.params.id;
  Account.remove({ _id: dataId }, (err, data) => {
    if (err) {
      console.log(err);
    }
    res.json({
      status: 200,
      msg: "删除成功",
      result: data,
    });
  });
});

module.exports = router;

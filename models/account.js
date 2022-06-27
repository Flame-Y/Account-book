//引入mongoose模块
const mongoose = require("mongoose");

const accountSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    amount: { type: String, default: 0 },
    amountType: { type: String, required: true },
    date: { type: String },
    showAmount: {
      type: String,
      default: 0,
    },
  },
  { collection: "myAccount", versionKey: false }
);

//导出model模块
module.exports = mongoose.model("account", accountSchema);

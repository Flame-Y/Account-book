<template>
  <div id="app">
    <el-container horizontal>
      <el-aside width="200px"><navigationBar /></el-aside>
      <el-container>
        <el-header>
          <el-col :span="12" v-show="showHeader"
            ><div class="grid-content bg-purple">
              <Search /></div
          ></el-col>
          <el-col :span="8" v-show="showHeader">
            <el-button
              type="primary"
              icon="el-icon-plus"
              @click="dialogFormVisible = true"
            ></el-button>
            <div class="grid-content bg-purple"></div
          ></el-col>

          <el-dialog
            title="添加账目"
            :visible.sync="dialogFormVisible"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            @close="handleClose"
          >
            <el-form :model="form" :rules="rules" ref="addForm">
              <el-form-item
                label="账目名称"
                prop="name"
                :label-width="formLabelWidth"
              >
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="账目金额"
                prop="amount"
                :label-width="formLabelWidth"
              >
                <el-input
                  v-model.number="form.amount"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="账目类型"
                prop="amountType"
                :label-width="formLabelWidth"
              >
                <el-select
                  v-model="form.amountType"
                  placeholder="请选择收入/支出"
                >
                  <el-option label="收入" value="+"></el-option>
                  <el-option label="支出" value="-"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="日期"
                prop="date"
                :label-width="formLabelWidth"
              >
                <el-input
                  v-model="form.date"
                  autocomplete="off"
                  placeholder="以年-月-日格式填写 默认为当天日期"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button
                @click="
                  dialogFormVisible = false;
                  closeThis();
                "
                >取 消</el-button
              >
              <el-button @click="resetForm('addForm')">重置</el-button>
              <el-button type="primary" @click="postToAdd('addForm')"
                >确 定</el-button
              >
            </div>
          </el-dialog>
        </el-header>
        <el-main
          ><router-view
            ref="tableData"
            @toShowHeader="toShowHeader"
          ></router-view
        ></el-main>
        <el-footer></el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import axios from "axios";
import Search from "./components/Search";
import navigationBar from "./components/navigationBar";
export default {
  name: "App",
  data() {
    var checkName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("账目名称不能为空"));
      }
      callback();
    };
    var checkAmount = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("账目金额不能为空"));
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error("请输入数字值"));
        } else {
          callback();
        }
      }, 1000);
    };
    var checkAmountType = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("必须选择账目类型"));
      }
      callback();
    };
    // var checkDate = (rule, value, callback) => {
    //   if (value === "") {
    //     callback(new Error("必须选择账目类型"));
    //   }
    // };
    return {
      fullscreenLoading: true,
      dialogFormVisible: false,
      showHeader: false,
      form: {
        name: "",
        amount: "",
        amountType: "",
        date: "",
      },
      formLabelWidth: "120px",
      addThing: "",
      addNumber: "",
      getName: "",
      changeID: "",
      changeName: "",
      changeAmount: "",
      removeID: "",
      rules: {
        name: [{ validator: checkName, trigger: "blur" }],
        amount: [{ validator: checkAmount, trigger: "blur" }],
        amountType: [{ validator: checkAmountType, trigger: "blur" }],
        // date: [{ validator: checkDate, trigger: "blur" }],
      },
    };
  },
  components: {
    Search,
    navigationBar,
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    toShowHeader(val) {
      this.showHeader = val;
    },
    openFullScreen1() {
      this.fullscreenLoading = true;
      setTimeout(() => {
        this.fullscreenLoading = false;
      }, 1500);
    },
    handleClose() {
      Object.assign(this.$data, this.$options.data());
      // 防止复原数据把header部分隐藏
      this.showHeader = true;
    },
    closeThis() {
      this.$message({
        type: "info",
        message: "已取消添加",
      });
    },
    postToHistory() {
      axios
        .get("http://localhost:27017/account/getHistory")
        .then((response) => {
          console.log(response);
          this.$refs.tableData.tableData = response.data.data;
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
    postToAdd(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1;
          const date = now.getDate();
          const time = year + "-" + month + "-" + date;
          var qs = require("qs");
          var data = qs.stringify({
            name: this.form.name,
            amount: this.form.amount,
            amountType: this.form.amountType,
            date: this.form.date ? this.form.date : time,
            showAmount: this.form.amount
              ? this.form.amountType + this.form.amount
              : this.form.amount,
          });
          axios({
            method: "post",
            url: "http://localhost:27017/account/add",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            data: data,
          })
            .then((response) => {
              console.log("请求成功", response.data);
              window.location.reload();
              this.$message({
                type: "success",
                message: "添加成功!",
                flag: true,
              });
            })
            .catch((error) => {
              console.log("请求失败", error.message);
              this.$message({
                type: "error",
                message: "添加失败!",
              });
            });
        } else {
          return false;
        }
      });
    },
    postToChange(inputID, inputName, inputAmount, inputAmountType, inputDate) {
      var axios = require("axios");
      var qs = require("qs");
      var data = qs.stringify({
        name: inputName,
        amount: inputAmount,
        amountType: inputAmountType,
        showAmount: inputAmountType + inputAmount,
        date: inputDate,
      });
      var config = {
        method: "put",
        url: `http://localhost:27017/account/${inputID}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
      };

      axios(config)
        .then((response) => {
          console.log("请求成功", response.data);
          this.$message({
            type: "success",
            message: "修改成功!",
            flag: true,
          });
          this.postToHistory();
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          this.$message({
            type: "error",
            message: "修改失败!",
          });
        });
    },
    postToRemove(id) {
      var config = {
        method: "delete",
        url: `http://localhost:27017/account/${id}`,
        headers: {},
      };
      axios(config)
        .then((response) => {
          console.log("请求成功", response.data);
          window.location.reload();
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
  },
  created() {
    this.openFullScreen1();
  },
  mounted() {
    this.$bus.$off("deleteData").$on("deleteData", (id) => {
      this.postToRemove(id);
    });
    this.$bus.$off("modifyData").$on("modifyData", (formData) => {
      this.postToChange(
        formData.id,
        formData.name,
        formData.amount,
        formData.amountType,
        formData.date
      );
    });
  },
  // updated() {
  //   this.postToHistory();
  // },
};
</script>

<style scoped>
.calendar {
  text-align: center;
  width: 400px;
}
.el-header,
.el-footer {
  background-color: #545c64;
  color: #333;
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
  /* line-height: 100px; */
}
.el-aside {
  background-color: #545c64;
  color: #333;
  /* text-align: center; */
  line-height: 320px;
}
@media screen and (max-width: 768px) {
  .el-aside {
    display: none !important;
  }
}
</style>

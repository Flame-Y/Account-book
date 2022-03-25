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
            <el-form :model="form">
              <el-form-item label="账目名称" :label-width="formLabelWidth">
                <el-input v-model="form.name" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="账目金额" :label-width="formLabelWidth">
                <el-input v-model="form.amount" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="账目类型" :label-width="formLabelWidth">
                <el-select
                  v-model="form.amountType"
                  placeholder="请选择收入/支出"
                >
                  <el-option label="收入" value="+"></el-option>
                  <el-option label="支出" value="-"></el-option>
                </el-select>
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
              <el-button
                type="primary"
                @click="
                  dialogFormVisible = false;
                  postToAdd();
                "
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
    return {
      fullscreenLoading: true,
      dialogFormVisible: false,
      showHeader: false,
      form: {
        name: "",
        amount: "",
        amountType: "",
      },
      formLabelWidth: "120px",
      addThing: "",
      addNumber: "",
      getName: "",
      changeID: "",
      changeName: "",
      changeAmount: "",
      removeID: "",
    };
  },
  components: {
    Search,
    navigationBar,
    // switchColor,
  },
  methods: {
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
    postToFocus() {
      axios
        .post("/api/getFocus")
        .then((response) => {
          console.log("请求成功", response.data);
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
    postToHistory() {
      axios
        .post("/api/getHistory")
        .then((response) => {
          this.$refs.tableData.tableData = response.data.data;
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
    postToAdd() {
      var fAdd = new FormData();
      fAdd.append("name", this.form.name);
      fAdd.append("number", this.form.amountType + this.form.amount);
      axios
        .post(`/api/addDeal?`, fAdd)
        .then((response) => {
          console.log("请求成功", response.data);
          this.postToHistory();
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
    },
    postToSearch() {
      var fSearch = new FormData();
      fSearch.append("name", this.getName);
      axios
        .post(`/api/search?`, fSearch)
        .then((response) => {
          console.log("请求成功", response.data.data);
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
    postToChange(inputID, inputName, inputNumber) {
      var fchange = new FormData();
      fchange.append("id", parseInt(inputID));
      fchange.append("name", inputName);
      fchange.append("number", inputNumber);
      axios
        .post(`/api/change?`, fchange)
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
      var fremove = new FormData();
      fremove.append("id", parseInt(id));
      axios
        .post(`/api/remove?`, fremove)
        .then((response) => {
          console.log("请求成功", response.data);
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
  },
  created() {
    this.openFullScreen1();
    this.postToHistory();
  },
  mounted() {
    this.$bus.$off("deleteData").$on("deleteData", (id) => {
      this.postToRemove(id);
      // console.log(id);
      this.postToHistory();
    });
    this.$bus.$off("modifyData").$on("modifyData", (formData) => {
      this.postToChange(
        formData.id,
        formData.name,
        formData.amountType + formData.amount
      );
      this.postToHistory();
    });
  },
  updated() {
    this.postToHistory();
  },
};
</script>

<style scoped>
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

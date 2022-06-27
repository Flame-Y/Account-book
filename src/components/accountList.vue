<template>
  <div id="con">
    <transition name="el-zoom-in-center">
      <template>
        <div>
          <el-table
            :data="
              tableData.slice((currpage - 1) * pagesize, currpage * pagesize)
            "
            style="width: 100%"
            border
            show-summary
            :summary-method="getSummaries"
            sum-text="总和"
            max-height="470"
            ref="multipleTable"
            v-show="show2"
          >
            <el-table-column prop="date" label="时间" sortable width="180">
            </el-table-column>
            <el-table-column prop="name" label="事件"> </el-table-column>
            <el-table-column
              prop="showAmount"
              label="金额"
              sortable
              width="180"
            >
              <!-- <template slot-scope="scope">
                <p>{{ scope.row.amountType + scope.row.amount }}</p>
              </template> -->
            </el-table-column>
            <el-table-column prop="operation" label="操作" width="120">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  circle
                  @click="
                    dialogFormVisible = true;
                    getData(scope.row);
                  "
                ></el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  @click="openDelete(scope.row._id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            background
            layout="prev, pager, next, total,
        jumper"
            :page-size="pagesize"
            :total="tableData.length"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
          >
          </el-pagination>
        </div>
      </template>
    </transition>
    <el-dialog
      title="修改账目"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form :model="form"
        ><el-form-item label="日期" :label-width="formLabelWidth">
          <el-input v-model="form.date" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账目名称" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账目金额" :label-width="formLabelWidth">
          <el-input v-model="form.amount" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账目类型" :label-width="formLabelWidth">
          <el-select v-model="form.amountType">
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
            modifyAmmount(form);
          "
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<style>
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>

<script>
import axios from "axios";

export default {
  methods: {
    postToHistory() {
      let me = this;
      axios
        .get("http://localhost:27017/account/getHistory")
        // .get(`/api/getHistory`)
        .then((response) => {
          console.log(response);
          me.tableData = response.data.data;
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
    postToSearch(name) {
      let me = this;
      var fSearch = new FormData();
      fSearch.append("name", name);
      axios
        .get(`http://localhost:27017/account/${name}`)
        .then((response) => {
          console.log("请求成功", response);
          me.tableData = response.data.data;
        })
        .catch((error) => {
          console.log("请求失败", error.message);
        });
    },
    getData(data) {
      this.form.name = data.name;
      this.form.amount = data.amount;
      // this.form.amountType = data.amountType === "-" ? "支出" : "收入";
      this.form.amountType = data.amountType;
      this.form.id = data._id;
      this.form.date = data.date;
    },
    // 未修改的回调函数
    closeThis() {
      this.$message({
        type: "info",
        message: "已取消修改",
      });
    },
    // 控制header部分的显示
    toShowHeader() {
      this.$emit("toShowHeader", true);
    },
    showTable() {
      this.show2 = true;
    },
    modifyAmmount(id) {
      this.$bus.$emit("modifyData", id);
    },
    getSummaries(param, arr = ["name"]) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        let bor = true;
        if (
          arr.length > 0 &&
          arr.find((item) => item == column.property) != undefined
        ) {
          bor = false;
        }
        const values = data.map((item) => Number(item[column.property]));
        if (!values.every((value) => isNaN(value)) && bor) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return Number(prev) + Number(curr);
            } else {
              return Number(prev);
            }
          }, 0);
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    // 标签功能可能会用到的颜色 暂未实装
    openDelete(index) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$bus.$emit("deleteData", index);
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.postToHistory();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // tableRowClassName({ rowIndex }) {
    //   if (rowIndex === 1) {
    //     return "warning-row";
    //   } else if (rowIndex === 3) {
    //     return "success-row";
    //   }
    //   return "";
    // },
    handleCurrentChange(cpage) {
      this.currpage = cpage;
    },
    handleSizeChange(psize) {
      this.pagesize = psize;
    },
  },
  data() {
    return {
      show2: false,
      dialogFormVisible: false,
      form: {
        name: "",
        amount: "",
        amountType: "",
        id: "",
        date: "",
      },
      formLabelWidth: "120px",
      tableData: [],
      pagesize: 10,
      currpage: 1,
      searchName: "",
      showHeader: true,
    };
  },
  mounted() {
    this.postToHistory();
    this.$bus.$on("searchName", (data) => {
      if (data === "") {
        return;
      }
      this.postToSearch(data);
    });
    this.toShowHeader();
    this.showTable();
  },
  computed: {
    tables() {
      const input = this.searchName;
      if (input) {
        return this.tableData.filter((data) => {
          return Object.keys(data).some((key) => {
            return String(data[key]).toLowerCase().indexOf(input) > -1;
          });
        });
      }
      return this.tableData;
    },
  },
};
</script>

<style scoped>
.con {
  height: 460px;
}
.el-table {
  overflow: visible !important;
  /* 用分页功能的时候启用 */
  /* height: 100%; */
}
.el-pagination {
  text-align: center;
}
</style>
目前还没有解决的问题：
1.分页启用后总和会变成每个分页的总和
2.分页功能和动画效果不能并存
3.分页功能会影响表单的高度，导致样式不美观
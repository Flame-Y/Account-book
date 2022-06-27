<template>
  <div>
    <p>总和：{{ sum }}</p>

    <div ref="myChart" id="myChart"></div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      earning: "",
      expend: "",
      sum: "",
    };
  },
  mounted() {
    this.postToFocus();
    this.toShowHeader();
  },
  methods: {
    // 控制header部分的显示
    toShowHeader() {
      this.$emit("toShowHeader", false);
    },
    postToFocus() {
      axios
        .get("http://localhost:27017/account/getHistory")
        .then((response) => {
          let earning = 0;
          let expend = 0;
          for (let i = 0; i < response.data.data.length; i++) {
            if (response.data.data[i].amountType === "+") {
              earning += parseInt(response.data.data[i].amount);
            } else {
              expend += parseInt(response.data.data[i].amount);
            }
          }
          this.earning = earning;
          this.expend = expend;
          this.sum = earning - expend;
          this.setMyEchart();
        })
        .catch((error) => {
          console.log("请求失败", error.message);
          alert("获取数据失败");
        });
    },
    setMyEchart() {
      const myChart = this.$refs.myChart; //通过ref获取到DOM节点
      if (myChart) {
        const thisChart = this.$echarts.init(myChart); //利用原型调取Echarts的初始化方法
        const option = {
          series: [
            {
              type: "pie",
              data: [
                {
                  value: this.earning,
                  name: "收入  " + this.earning,
                },
                {
                  value: this.expend,
                  name: "支出  " + this.expend,
                },
              ],
              radius: "75%",
            },
          ],
        }; //{}内写需要图表的各种配置，可以在官方案例中修改完毕后复制过来
        thisChart.setOption(option); //将编写好的配置项挂载到Echarts上
        window.addEventListener("resize", function () {
          thisChart.resize(); //页面大小变化后Echarts也更改大小
        });
      }
    },
  },
};
</script>

<style scoped>
div {
  height: 470px;
}
.el-header {
  display: none;
}
</style>
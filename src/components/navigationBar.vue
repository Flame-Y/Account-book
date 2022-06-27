<template>
  <div>
    <el-row class="tac">
      <el-col>
        <el-menu
          default-active="homepage"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
        >
          <el-menu-item index="homepage">
            <i class="el-icon-menu"></i>
            <span slot="title"> 主页</span>
          </el-menu-item>
          <el-menu-item index="statistic">
            <i class="el-icon-document"></i>
            <span slot="title"> 统计</span>
          </el-menu-item>
          <el-menu-item index="3" disabled>
            <i class="el-icon-setting"></i>
            <span slot="title"> 设置</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>



<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>
<style scoped>
.el-menu {
  border: none;
}
</style>
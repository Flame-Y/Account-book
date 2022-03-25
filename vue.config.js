const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,

  devServer: {
    proxy: {
      "/api": {
        target: "http://119.23.54.229:8080/qds/account",
        pathRewrite: {
          '^/api': '' // 将开头的 '/api' 替换成空字符串（^ 是开头的意思，'^/api' 表示以 /api 开头）
        },
        ws: true,
        changeOrigin: true,
      },
    },
  },
});

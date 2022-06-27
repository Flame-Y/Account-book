const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  publicPath: "./",
  devServer: {
    proxy: {
      "/api": {
        target: "http://localhost:27017/account",
        pathRewrite: {
          "^/api": "", // 将开头的 '/api' 替换成空字符串（^ 是开头的意思，'^/api' 表示以 /api 开头）
        },
        changeOrigin: true,
      },
    },
  },
});

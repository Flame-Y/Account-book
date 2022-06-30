# 在线记账本 使用引导

## 注意
主分支为MongoDB本地服务器 
master分支为上古版本使用后台接口，已废弃
mongo分支为MongoDB云服务器
## 安装 / 启动项目 

```
# 克隆项目
git clone https://github.com/Flame-Y/Account-book.git

# 安装依赖
npm install

# 可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org


```

# 主分支操作
开两个终端 
一个npm run serve
另一个node app.js/npx nodemon app.js

# mongo分支操作
(通过vscode左侧的第三个按钮 源代码管理 来切换分支到mongo)
不会的话也可以直接把mongo分支中的app.js的文件复制粘贴

然后直接npm run serve 
云服务器的请求可能会有点慢
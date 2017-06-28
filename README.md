# Zbbs 
一个简单的类论坛网站 
## 环境 
- Node.js v7.8.0 
- mongodb v3.4.4
## 安装 
1. 下载代码  
    <pre><code>git clone https://github.com/mrzxc/Zbbs.git</code></pre>
2. 安装依赖库 
    <pre><code>npm install</pre></code>
3. 设置credentials.js证书 来自[网易云通信与视频](http://netease.im/)短信验证码接口
## 应用模块、框架 
- 客户端 
  - 使用Bootstrap做主题样式和布局 
  - 使用Jquery作为前端js框架  
- 服务端 
  - 使用Node.js作为后端语言 
  - 使用Express作为后端框架 
  - 使用mongodb作为数据库 以及使用mongoose作为中间件
  - 使用Jade模板引擎 
  - 使用bcrypt对用户密码加密 
  - 使用网易云通信与视频短信接口  
## 目录 
- app (mvc) 
- bower_components (bootstrap和jquery)
- common (公共函数、方法) 
- config (配置项(路由))
- node_modules
- public (静态文件) 
- app.js (入口文件) 
- credentials.js (证书(短信平台token)) 
## 业务功能简介 
- '/login' 用户注册、登录、密码找回  
  - 手机号注册,由短信验证码验证 
  - 密码找回,通过手机短信验证码验证 
- '/' 帖子展示 
  - 异步载入 
  - 分页功能 
    - 一页最多8个帖子 
    - 页码最多可显示8个,多的使用省略号按钮代替 
- '/detail/:id' 帖子详情(权限管理在此) 
  - 帖子内容在后端渲染, 回复在前端异步加载 
  - 帖子本人打开帖子会有修改和删除按钮 
  - 回复功能 (现仅有添加回复功能)
## 未做的应做的事 
- 缺少可配置项管理 
- 测试和优化 
## 未做的不想做的事 
- 功能完善 

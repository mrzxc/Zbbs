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
3. 设置证书 来自[网易云通信与视频](http://netease.im/)短信验证码接口
    <pre><code>cd Zbb  
    touch credentials.js </pre></code>
    格式为: 
    <pre><code>module.exports =  {
      verify_app_secret: '',
      verify_app_key: ''
    }</pre></code>
    
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

## 功能简介 
- 分页:  
 分页支持
## 存留问题 
- 发帖现在只用了textarea,功能简单

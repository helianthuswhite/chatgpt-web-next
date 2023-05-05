<div align="center"><img width="100" style="display: block; margin: 0 auto;" src="https://raw.githubusercontent.com/helianthuswhite/chatgpt-web-next/c7372143ceb63310631a24ed0f8295e2487407c5/public/logo.svg" /><h1><a style="text-align: center;" href="https://chatalpha.top/" target="_blank">ChatAlpha</a></h1></div>

## 🚨 项目介绍

[ChatAlpha](https://github.com/helianthuswhite/chatgpt-web-next) 是基于 `ChatGPT` 的在线智能对话平台，除包含基础的 AI 对话功能之外，还提供了图片生成、智能工具、角色扮演等多种不同的玩法。整个项目支持了用户注册登录及积分购买与付费功能，且所有的功能的 **_前端代码_** 均已开源，开发者可以通过该项目进行学习和二次开发。

项目在线体验地址为：https://chatalpha.top/

> 如果您只有简单的私有化部署 `ChatGPT` 的需求，您可以切换到该项目的 `no-sql` 分支，该分支支持使用 `Railway.app` 进行一键部署，且不需要依赖任何服务端！

## 📌 功能列表

-   [x] 文本对话
-   [x] 图片对话
-   [x] 注册/登录
-   [x] 移动端适配
-   [x] 积分与付费功能
-   [ ] 夜间模式
-   [ ] 智能工具
-   [ ] 个人信息修改
-   [ ] 垂类数据问答
-   [ ] 自定义对话参数
-   [ ] 数据埋点
-   [ ] 更多功能，敬请期待...

## 🛠️ 本地开发

该项目为标准的 `NextJS` 项目，且使用 `Antd` 做为组件库，使用 `TailwindCSS` 进行样式处理，将本项目 `clone` 到本地之后通过以下命令安装项目依赖:

    npm install

项目依赖安装完成之后，需要在项目的根目录创建一个环境变量文件 `.env.local`，该文件已在 `.gitignore` 中添加，因此不会上传到项目仓库。

环境变量的配置如下所示：

```yml
# 服务端的endpoint地址，必填，由于该项目只有前端部分，因此需要自己实现一些后端接口并进行转发
BACKEND_ENDPOINT=

# 项目的通知信息，可选，用于展示项目公告信息，支持html文本
NOTICE=
```

环境变量设置完成之后，我们可以通过 `dev` 命令来启动项目，如下所示:

    npm run dev

## ⚙️ 编译和部署

我们可以在开发机或者服务器上使用基础的 `build` 命令来编译项目，如下：

    npm run build

当一个 `NextJS` 项目编译完成之后，在项目的根目录会生成一个 `.next` 文件夹，在该文件夹中即是编译完成后的产物，之后我们只需要使用 `start` 命令即可轻松启动项目：

    npm run start

我们也可以使用 `pm2` 等进程管理工具来启动项目，启动命令如下：

    pm2 start npm -- run start

_对于个人开发者来讲，这里推荐使用 [railway.app](https://railway.app/)、[vercel](https://vercel.com/)、[zeabur](https://zeabur.com/) 等 Serverless 服务进行部署，具体的部署方式可以查看对应服务的文档。_

## License

MIT © [helianthuswhite](./license)

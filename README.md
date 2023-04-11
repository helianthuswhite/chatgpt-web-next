# ChatGPT Web NextJS

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/-4ukN3?referralCode=ZtthnC)

English | [中文文档](./README-zh_CN.md)

## Introduction

> This project comes from the origin project [chatgpt-web](https://github.com/Chanzhaoyu/chatgpt-web) which is an excellent chatgpt website.

[chatgpt-web-next](https://github.com/helianthuswhite/chatgpt-web-next) uses the `NextJS` and `TailwindCSS` to develop, and uses the `railway.app` to deploy for free.

You can experience it through this website [chat.helianthuswhite.cn](https://chat.helianthuswhite.cn/). Of course, I won't store anything because all your conversations are store in your localstorage. when you clear your browser's cache, it's cleared too.

## Development

This is a standard `nextjs` project, then you can use the `install` command to install dependencies:

    npm install --legacy-peer-deps

or use `cnpm`:

    cnpm install

After install, you need to config the environment variables.

Just create a file named `.env.local` which has been ignored by the `.gitignore` file.

Here are the variables you can set in the `.env.local` file.

```yml
# OpenAI API Key - https://platform.openai.com/overview
OPENAI_API_KEY=

# change this to an `accessToken` extracted from the ChatGPT site's `https://chat.openai.com/api/auth/session` response
OPENAI_ACCESS_TOKEN=

# OpenAI API Base URL - https://api.openai.com
OPENAI_API_BASE_URL=

# OpenAI API Model - https://platform.openai.com/docs/models
OPENAI_API_MODEL=

# Reverse Proxy
API_REVERSE_PROXY=

# timeout
TIMEOUT_MS=100000

# Socks Proxy Host
SOCKS_PROXY_HOST=

# Socks Proxy Port
SOCKS_PROXY_PORT=

# Simple Authorization Tokens - 'xxxxx,xxxxx'
LOCAL_ACCESS_TOKENS=
```

If you set the correct variables, you can start the project by the `dev` command:

    npm run dev

## Build and Deploy

### Node Service

As a normal node service, you can use the following command to build on your deploy server.

    npm run build

The `nextjs` will execute the build process and generate all files in the `.next` folder. After build, use the `start` command to start the server.

    npm run start

You can also use a daemon process like `pm2` like this.

    pm2 start npm -- run start

### Docker Image

Here also provides a way to deploy by using a docker image. Just run the following command in the project dir (If you have installed docker and start the service).

    docker build -t chatgpt-web-next .

You can see the [Dockerfile](./Dockerfile) for more information about the process.

When the image produce successful, just run it as the common docker service.

    docker run --name chatgpt -d -p 3000:3000 --env OPENAI_API_KEY=sk-xxxx --env SOCKS_PROXY_HOST=127.0.0.1 --env SOCKS_PROXY_PORT=7890

> Note that the docker variables should be set correctly.

### Cloud Services

Uising a cloud service to deploy is recommended. [railway.app](https://railway.app/)、[vercel](https://vercel.com/)、[zeabur](https://zeabur.com/) etc are good choices.

You may choose what you like and see the official docs for deploying.

## Environment Variables

| Environment Variable  | Required                                    | Description                                                                                                      |
| --------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `TIMEOUT_MS`          | Optional                                    | Timeout in milliseconds                                                                                          |
| `OPENAI_API_KEY`      | Optional                                    | Required for `OpenAI API`. `apiKey` can be obtained from [here](https://platform.openai.com/overview).           |
| `OPENAI_ACCESS_TOKEN` | Optional                                    | Required for `Web API`. `accessToken` can be obtained from [here](https://chat.openai.com/api/auth/session).     |
| `OPENAI_API_BASE_URL` | Optional, only for `OpenAI API`             | API endpoint.                                                                                                    |
| `OPENAI_API_MODEL`    | Optional, only for `OpenAI API`             | API model.                                                                                                       |
| `API_REVERSE_PROXY`   | Optional, only for `Web API`                | Reverse proxy address for `Web API`. [Details](https://github.com/transitive-bullshit/chatgpt-api#reverse-proxy) |
| `SOCKS_PROXY_HOST`    | Optional, effective with `SOCKS_PROXY_PORT` | Socks proxy.                                                                                                     |
| `SOCKS_PROXY_PORT`    | Optional, effective with `SOCKS_PROXY_HOST` | Socks proxy port.                                                                                                |
| `LOCAL_ACCESS_TOKENS` | Optional                                    | Simple authorization tokens, empty means no auth control.                                                        |

> Note: Changing environment variables in Railway will cause re-deployment.

## License

MIT © [helianthuswhite](./license)

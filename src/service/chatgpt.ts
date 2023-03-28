import * as dotenv from "dotenv";
import type { ChatGPTAPIOptions, ChatMessage, SendMessageOptions, FetchFn } from "chatgpt";
import { ChatGPTAPI, ChatGPTUnofficialProxyAPI } from "chatgpt";
import { SocksProxyAgent } from "socks-proxy-agent";
import fetch from "node-fetch";

export interface SendResponseOptions {
    status: "success" | "fail";
    message?: string;
    data?: any;
}

export interface ChatContext {
    conversationId?: string;
    parentMessageId?: string;
}

export interface ChatGPTUnofficialProxyAPIOptions {
    accessToken: string;
    apiReverseProxyUrl?: string;
    model?: string;
    debug?: boolean;
    headers?: Record<string, string>;
    fetch?: FetchFn;
}

export interface ModelConfig {
    apiModel?: ApiModel;
    reverseProxy?: string;
    timeoutMs?: number;
    socksProxy?: string;
}

export type ApiModel = "ChatGPTAPI" | "ChatGPTUnofficialProxyAPI" | undefined;

const ErrorCodeMessage: Record<string, string> = {
    401: "[OpenAI] 提供错误的API密钥 | Incorrect API key provided",
    403: "[OpenAI] 服务器拒绝访问，请稍后再试 | Server refused to access, please try again later",
    502: "[OpenAI] 错误的网关 |  Bad Gateway",
    503: "[OpenAI] 服务器繁忙，请稍后再试 | Server is busy, please try again later",
    504: "[OpenAI] 网关超时 | Gateway Time-out",
    500: "[OpenAI] 服务器繁忙，请稍后再试 | Internal Server Error",
};

dotenv.config();

const timeoutMs: number = !isNaN(+process.env.TIMEOUT_MS) ? +process.env.TIMEOUT_MS : 30 * 1000;

let apiModel: ApiModel;
let api: ChatGPTAPI | ChatGPTUnofficialProxyAPI;

export const installChatGPT = async () => {
    if (api) {
        return;
    }

    if (!process.env.OPENAI_API_KEY && !process.env.OPENAI_ACCESS_TOKEN)
        throw new Error("Missing OPENAI_API_KEY or OPENAI_ACCESS_TOKEN environment variable");

    // More Info: https://github.com/transitive-bullshit/chatgpt-api
    if (process.env.OPENAI_API_KEY) {
        const OPENAI_API_MODEL = process.env.OPENAI_API_MODEL;
        const model =
            typeof OPENAI_API_MODEL === "string" && OPENAI_API_MODEL.length > 0
                ? OPENAI_API_MODEL
                : "gpt-3.5-turbo";

        const options: ChatGPTAPIOptions = {
            apiKey: process.env.OPENAI_API_KEY,
            completionParams: { model },
            debug: false,
        };

        if (process.env.OPENAI_API_BASE_URL && process.env.OPENAI_API_BASE_URL.trim().length > 0)
            options.apiBaseUrl = process.env.OPENAI_API_BASE_URL;

        if (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT) {
            const agent = new SocksProxyAgent({
                hostname: process.env.SOCKS_PROXY_HOST,
                port: process.env.SOCKS_PROXY_PORT,
            });
            // @ts-ignore
            options.fetch = (url, options) => fetch(url, { agent, ...options });
        }

        api = new ChatGPTAPI({ ...options });
        apiModel = "ChatGPTAPI";
    } else {
        const options: ChatGPTUnofficialProxyAPIOptions = {
            accessToken: process.env.OPENAI_ACCESS_TOKEN,
            debug: false,
        };

        if (process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT) {
            const agent = new SocksProxyAgent({
                hostname: process.env.SOCKS_PROXY_HOST,
                port: process.env.SOCKS_PROXY_PORT,
            });
            // @ts-ignore
            options.fetch = (url, options) => fetch(url, { agent, ...options });
        }

        if (process.env.API_REVERSE_PROXY)
            options.apiReverseProxyUrl = process.env.API_REVERSE_PROXY;

        api = new ChatGPTUnofficialProxyAPI({ ...options });
        apiModel = "ChatGPTUnofficialProxyAPI";
    }
};

export const sendResponse = (options: SendResponseOptions) => {
    if (options.status === "success") {
        return Promise.resolve({
            message: options.message ?? null,
            data: options.data ?? null,
            status: options.status,
        });
    }

    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject({
        message: options.message ?? "fail",
        data: options.data ?? null,
        status: options.status,
    });
};

export const chatReplyProcess = async (
    message: string,
    lastContext?: { conversationId?: string; parentMessageId?: string },
    process?: (chat: ChatMessage) => void
) => {
    try {
        let options: SendMessageOptions = { timeoutMs };

        if (lastContext) {
            if (apiModel === "ChatGPTAPI")
                options = { parentMessageId: lastContext.parentMessageId };
            else options = { ...lastContext };
        }

        const response = await api.sendMessage(message, {
            ...options,
            onProgress: (partialResponse) => {
                process?.(partialResponse);
            },
        });

        return sendResponse({ status: "success", data: response });
    } catch (error: any) {
        const code = error.statusCode;
        global.console.log(error);
        if (Reflect.has(ErrorCodeMessage, code))
            return sendResponse({ status: "fail", message: ErrorCodeMessage[code] });
        return sendResponse({
            status: "fail",
            message: error.message ?? "Please check the back-end console",
        });
    }
};

export const chatConfig = () =>
    sendResponse({
        status: "success",
        data: {
            apiModel,
            reverseProxy: process.env.API_REVERSE_PROXY,
            timeoutMs,
            socksProxy:
                process.env.SOCKS_PROXY_HOST && process.env.SOCKS_PROXY_PORT
                    ? `${process.env.SOCKS_PROXY_HOST}:${process.env.SOCKS_PROXY_PORT}`
                    : "-",
        } as ModelConfig,
    });

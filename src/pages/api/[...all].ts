// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TOKEN_MAX_AGE, USER_TOKEN } from "@/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";

export interface SendResponseOptions {
    status: "success" | "fail";
    message?: string;
    data?: any;
}

export const sendResponse = (options: SendResponseOptions) => {
    if (options.status === "success") {
        return Promise.resolve({
            message: options.message ?? null,
            data: options.data ?? null,
            status: options.status,
        });
    }

    return Promise.reject({
        message: options.message ?? "fail",
        data: options.data ?? null,
        status: options.status,
    });
};

export default async function handler(originReq: NextApiRequest, originRes: NextApiResponse) {
    return httpProxyMiddleware(originReq, originRes, {
        target: process.env.BACKEND_ENDPOINT,
        changeOrigin: true,
        selfHandleResponse: true,
        onProxyInit(httpProxy) {
            httpProxy.on("proxyRes", (proxyRes, req, res) => {
                let responseData = "";
                proxyRes.on("data", (chunk) => {
                    responseData += chunk;
                });

                proxyRes.on("end", () => {
                    try {
                        const data = JSON.parse(responseData);
                        const { code, data: originalData, msg } = data;
                        const transformedData = {
                            data: originalData,
                            message: msg,
                            status: code === 0 ? "success" : "fail",
                        };
                        const transformedResponse = JSON.stringify(transformedData);

                        //  handle login and register, use cookie to auth
                        if (
                            code === 0 &&
                            originalData &&
                            (req.url?.includes("/login") || req.url?.includes("/register"))
                        ) {
                            res.setHeader(
                                "Set-Cookie",
                                `${USER_TOKEN}=${originalData}; path=/; Max-Age=${TOKEN_MAX_AGE}; HttpOnly`
                            );
                        }

                        res.setHeader("Content-Type", "application/json");
                        res.end(transformedResponse);
                    } catch (err) {
                        sendResponse({ status: "fail", message: "Invalid response" });
                    }
                });
            });
        },
    });
}

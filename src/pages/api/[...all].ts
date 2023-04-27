// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import * as dotenv from "dotenv";
import { TOKEN_MAX_AGE, USER_TOKEN } from "@/constants";
import type { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";
import { getAuthHeader } from "@/service/server";
import logger from "@/service/logger";

dotenv.config();

export default async function handler(originReq: NextApiRequest, originRes: NextApiResponse) {
    // originReq.body = convertRequestKey(originReq.body);
    logger.info("api-proxy", originReq.url);

    const authHeader = getAuthHeader(originReq);
    originReq.headers = {
        ...originReq.headers,
        ...authHeader,
    };

    if (process.env.NODE_ENV !== "production") {
        delete originReq.headers["accept-encoding"];
    }

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
                        logger.info("api-proxy", "proxy response:", data);

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
                            logger.error("api-proxy", "request auth error, clear cookie");
                        }

                        res.setHeader("Content-Type", "application/json");
                        res.end(transformedResponse);
                        logger.info("api-proxy", "response to client:", transformedData);
                    } catch (err: any) {
                        logger.error("api-proxy", "proxy response error:", err.message || err);
                        res.end(
                            JSON.stringify({
                                status: "fail",
                                message: "Invalid response",
                                code: 500,
                            })
                        );
                    }
                });
            });
        },
    });
}

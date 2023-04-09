// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import httpProxyMiddleware from "next-http-proxy-middleware";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    return httpProxyMiddleware(req, res, {
        target: process.env.BACKEND_ENDPOINT,
        changeOrigin: true,
    });
}

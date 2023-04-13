import { USER_TOKEN } from "@/constants";
import logger from "@/service/logger";
import { sendResponse } from "@/service/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Set-Cookie", `${USER_TOKEN}=; path=/; Max-Age=0; HttpOnly`);
    res.setHeader("Content-Type", "application/json");

    logger.info("logout", req.url, req.body);

    const data = await sendResponse({ status: "success", message: "登出成功" });
    res.write(JSON.stringify(data));
    res.end();

    logger.info("logout", "logout success");
}

import logger from "@/service/logger";
import { sendResponse } from "@/service/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    logger.info("notice", req.url, req.body);

    const data = await sendResponse({ status: "success", data: process.env.NOTICE });
    res.write(JSON.stringify(data));
    res.end();

    logger.info("notice", "send to client", process.env.NOTICE);
}

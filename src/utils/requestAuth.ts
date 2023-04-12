import { sendResponse } from "@/service/server";
import { NextApiRequest } from "next";

const requestAuth = (req: NextApiRequest) => {
    const tokens = process.env.LOCAL_ACCESS_TOKENS?.split(",");
    const token = req.headers.authorization;

    if (!process.env.LOCAL_ACCESS_TOKENS) {
        return Promise.resolve();
    }

    if (!token || !tokens?.length) {
        return sendResponse({
            status: "fail",
            message: "No authorization token provided",
            code: 401,
        });
    }

    if (!tokens.includes(token)) {
        return sendResponse({ status: "fail", message: "Invalid authorization token", code: 401 });
    }
};

export default requestAuth;

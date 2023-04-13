// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { chatReplyProcess, installChatGPT } from "@/service/chatgpt";
import logger from "@/service/logger";
import { fetchServer } from "@/service/server";
import { ConversationRequest } from "@/store/Chat";
import { ChatMessage } from "chatgpt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Content-type", "application/octet-stream");
    logger.info("chat-progress", req.url, req.body);

    try {
        // await requestAuth(req);
        await installChatGPT();
        const { prompt, options = {} } = req.body as {
            prompt: string;
            options?: ConversationRequest;
        };
        let firstChunk = true;

        const response = await chatReplyProcess(prompt, options, (chat: ChatMessage) => {
            res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`);
            firstChunk = false;
        });

        logger.info("chat-progress", "chatgpt response:", response);

        if (response.detail) {
            const { model, usage } = response.detail;
            await fetchServer("/api/v1/integral/record", req, {
                body: JSON.stringify({
                    model,
                    size: usage?.total_tokens,
                    type: "chat",
                }),
            });

            logger.info("chat-progress", "record integral success");
        }
    } catch (error: any) {
        logger.error("chat-progress", "chat-progress error:", error);

        const response = { status: "fail", message: error.message, code: 500 };
        res.write(JSON.stringify(response));
    } finally {
        res.end();
    }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { chatReplyProcess, installChatGPT } from "@/service/chatgpt";
import { ConversationRequest } from "@/store/Chat";
import { ChatMessage } from "chatgpt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Content-type", "application/octet-stream");
    await installChatGPT();

    try {
        const { prompt, options = {} } = req.body as {
            prompt: string;
            options?: ConversationRequest;
        };
        let firstChunk = true;
        await chatReplyProcess(prompt, options, (chat: ChatMessage) => {
            res.write(firstChunk ? JSON.stringify(chat) : `\n${JSON.stringify(chat)}`);
            firstChunk = false;
        });
    } catch (error) {
        res.write(JSON.stringify(error));
    } finally {
        res.end();
    }
}

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { chatReplyProcess, installChatGPT } from "@/service/chatgpt";
import { fetchServer } from "@/service/server";
import { ConversationRequest } from "@/store/Chat";
import { ChatMessage } from "chatgpt";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader("Content-type", "application/octet-stream");

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

        if (response.detail) {
            const { model, usage } = response.detail;
            await fetchServer("/api/v1/integral/record", req, {
                body: JSON.stringify({
                    model,
                    size: usage?.total_tokens,
                    type: "chat",
                }),
            });
        }
    } catch (error: any) {
        const response = { status: "fail", message: error.message, code: 500 };
        res.write(JSON.stringify(response));
    } finally {
        res.end();
    }
}

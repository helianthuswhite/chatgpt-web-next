import * as dotenv from "dotenv";
import fetch from "node-fetch";
import Keyv from "keyv";
import QuickLRU from "quick-lru";
import { get_encoding } from "@dqbd/tiktoken";
import { v4 as uuidv4 } from "uuid";
import logger from "@/service/logger";
import { getAuthHeader, sendResponse } from "@/service/server";
import { NextApiRequest, NextApiResponse } from "next";
import { ConversationRequest } from "@/store/Chat";

export interface ChatMessage {
    role: string;
    content: string;
    parentMessageId?: string;
    messageId: string;
}

export interface ImageMessage {
    n?: number;
    prompt: string;
    responseFormat?: "url" | "b64_json";
    size?: "256x256" | "512x512" | "1024x1024";
    user?: string;
}

export interface ChatContext {
    parentMessageId?: string;
    isImage?: boolean;
}

dotenv.config();

const maxModelTokens = 4000;
const maxResponseTokens = 1000;
const maxMessageCount = 10;
const systemMessage = {
    role: "system",
    messageId: uuidv4(),
    content: `You are ChatGPT, a large language model trained by OpenAI. Answer as concisely as possible.\nKnowledge cutoff: 2021-09-01\nCurrent date: ${
        new Date().toISOString().split("T")[0]
    }`,
};

const messageStore = new Keyv<ChatMessage, any>({
    store: new QuickLRU<string, ChatMessage>({ maxSize: 10000 }),
});
const tokenizer = get_encoding("cl100k_base");

export const getTokenCount = (text: string) => {
    return tokenizer.encode(text.replace(/<\|endoftext\|>/g, "")).length;
};

export const buildMessage = async (message: ChatMessage, count = 0) => {
    const userLabel = "User";
    const assistantLabel = "ChatGPT";
    const maxNumTokens = maxModelTokens - maxResponseTokens;
    const { parentMessageId, role, content, messageId } = message;
    const currentMessage = {
        role,
        content,
        messageId,
    };
    const messages: ChatMessage[] = parentMessageId
        ? [currentMessage]
        : [currentMessage, systemMessage];
    count += parentMessageId ? 1 : 2;

    if (parentMessageId && count < maxMessageCount) {
        const parentMessage = await messageStore.get(parentMessageId);
        if (parentMessage) {
            const { messages: preMessages } = await buildMessage(parentMessage, count);
            messages.push(...preMessages);
        }
    }

    const prompt = messages
        .reduce((prompt, message) => {
            switch (message.role) {
                case "system":
                    return prompt.concat([`Instructions:\n${message.content}`]);
                case "user":
                    return prompt.concat([`${userLabel}:\n${message.content}`]);
                default:
                    return prompt.concat([`${assistantLabel}:\n${message.content}`]);
            }
        }, [] as string[])
        .join("\n\n");

    const numTokens = getTokenCount(prompt);

    const maxTokens = Math.max(1, Math.min(maxModelTokens - numTokens, maxResponseTokens));

    if (numTokens > maxNumTokens) {
        logger.error("chatgpt", "Prompt is too long ", numTokens);
    }

    return { messages, maxTokens, numTokens };
};

export const chatReplyProcess = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { prompt, options = {} } = req.body as {
            prompt: string;
            options?: ChatContext;
        };

        const messageId = uuidv4();
        const chatMessage: ChatMessage = {
            role: "user",
            messageId,
            parentMessageId: options?.parentMessageId,
            content: prompt,
        };
        const { messages, maxTokens } = await buildMessage(chatMessage);

        const response = await fetch(
            new URL("/api/v1/openai/v1/chat/completions", process.env.BACKEND_ENDPOINT),
            {
                method: req.method,
                headers: getAuthHeader(req),
                body: JSON.stringify({
                    messages: messages.reverse(),
                    maxTokens,
                    model: "gpt-3.5-turbo",
                    temperature: 0.8,
                    topP: 1,
                    presencePenalty: 1,
                    stream: true,
                }),
            }
        );

        if (!response.ok) {
            let reason: string;

            try {
                reason = await response.text();
            } catch (err) {
                reason = response.statusText;
            }

            const msg = `ChatGPT error ${response.status}: ${reason}`;
            throw { message: msg, code: response.status };
        }

        //  if the server response as json
        if (response.headers.get("content-type") === "application/json") {
            return await response.json();
        }

        //  default the server response is stream
        let chunks = "";
        let first = true;
        const result = {
            role: "assistant",
            id: uuidv4(),
            text: chunks,
        };
        if (response.body) {
            try {
                for await (const chunk of response.body) {
                    chunks += chunk.toString();
                    result.text = chunks;
                    const resultStr = JSON.stringify(result);
                    res.write(first ? resultStr : `\n${resultStr}`);
                    first = false;
                }
            } catch (err) {
                const msg = `ChatGPT error: ${err}`;
                throw { message: msg };
            }
        }

        await Promise.all([
            messageStore.set(result.id, {
                role: result.role,
                content: result.text,
                messageId: result.id,
                parentMessageId: messageId,
            }),
            messageStore.set(chatMessage.messageId, chatMessage),
        ]);

        logger.info("chatgpt", "ChatGPT response success");
    } catch (error: any) {
        const code = error.code || 500;
        const msg = error.message ?? "Please check the back-end console";
        logger.error("chatgpt", msg);
        return sendResponse({ status: "fail", message: msg, code });
    }
};

export const chatReplyImage = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const { prompt, options = {} } = req.body as {
            prompt: string;
            options?: ConversationRequest;
        };

        const model = options.model?.split("$")[1] || null;
        const response = await fetch(
            new URL("/api/v1/openai/v1/image", process.env.BACKEND_ENDPOINT),
            {
                method: req.method,
                headers: getAuthHeader(req),
                body: JSON.stringify({
                    model,
                    n: 1,
                    prompt,
                    responseFormat: "url",
                    size: "512x512",
                }),
            }
        );

        if (!response.ok) {
            let reason: string;

            try {
                reason = await response.text();
            } catch (err) {
                reason = response.statusText;
            }

            const msg = `get image error ${response.status}: ${reason}`;
            throw { message: msg, code: response.status };
        }

        const data = await response.json();
        logger.info("chatgpt", "get image success", data);
        res.end(JSON.stringify(data));
    } catch (error: any) {
        const code = error.code || 500;
        const msg = error.message ?? "Please check the back-end console";
        logger.error("chatgpt", "get image error", msg);
        return sendResponse({ status: "fail", message: msg, code });
    }
};

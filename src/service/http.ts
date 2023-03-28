import { message } from "antd";
import { Client, Options, Response } from "web-rest-client";
import { SendResponseOptions } from "@/service/chatgpt";

class HttpService extends Client {
    constructor() {
        super();

        this.responsePlugins.push((res: Response, next: () => void) => {
            const { status, data, statusText } = res;

            if (status !== 200 && statusText) {
                message.error(`${status} ${statusText}`);
            }

            if ((data as unknown as SendResponseOptions)?.status === "fail") {
                res.status = 999;
            }

            next();
        });
    }

    fetchChatAPIProgress(body: any, options: Omit<Options, "url" | "method">) {
        return this.post("/api/chat-progress", body, options);
    }
}

const http = new HttpService();
export default http;

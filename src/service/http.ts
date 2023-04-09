import { message } from "antd";
import { Client, Options, Response } from "web-rest-client";
import { SendResponseOptions } from "@/service/chatgpt";
import { LoginInfo, RegisterInfo } from "@/pages/login";

class HttpService extends Client {
    constructor() {
        super();

        this.responsePlugins.push((res: Response, next: () => void) => {
            const { status, data, statusText } = res;
            const { msg } = (data as unknown as { msg: string }) || {};

            if (status !== 200) {
                if (msg) {
                    message.error(msg);
                } else if (statusText) {
                    message.error(`${status} ${statusText}`);
                }
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

    login(body: LoginInfo) {
        return this.post("/api/v1/user/login", body);
    }

    sendCode(body: { email: string }) {
        return this.post("/api/v1/user/verify/send_code", body);
    }

    register(body: RegisterInfo) {
        return this.post("/api/v1/user/register", body);
    }
}

const http = new HttpService();
export default http;

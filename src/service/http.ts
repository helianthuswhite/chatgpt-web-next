import { message } from "antd";
import { Client, Options, Response } from "web-rest-client";
import { LoginInfo, RegisterInfo } from "@/pages/login";
import { SendResponseOptions } from "@/service/server";

class HttpService extends Client {
    constructor() {
        super();

        this.responsePlugins.push((res: Response, next: () => void) => {
            const { status, data, statusText } = res;
            const {
                message: msg,
                data: resData,
                status: successStatus,
            } = (data as unknown as SendResponseOptions) || {};
            const isSuccess = status === 200 && successStatus === "success";

            if (!isSuccess) {
                if (msg) {
                    message.error(msg);
                } else if (statusText) {
                    message.error(`${status} ${statusText}`);
                }
            } else {
                res.data = resData;
            }

            if (successStatus === "fail") {
                res.status = 999;
            }

            next();
        });
    }

    fetchChatAPIProgress(body: any, options: Omit<Options, "url" | "method">) {
        return this.post("/api/chat-progress", body, options);
    }

    login(body: LoginInfo) {
        return this.post("/api/v1/user/login", body) as Promise<string>;
    }

    sendCode(body: { email: string }) {
        return this.post("/api/v1/user/verify/send_code", body);
    }

    register(body: RegisterInfo) {
        return this.post("/api/v1/user/register", body) as Promise<string>;
    }

    getUserInfo() {
        return this.get("/api/v1/user/profile");
    }
}

const http = new HttpService();
export default http;

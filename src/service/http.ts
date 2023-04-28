import { message } from "antd";
import { Client, Options, Response } from "web-rest-client";
import { LoginInfo, RegisterInfo } from "@/pages/login";
import { SendResponseOptions } from "@/service/server";
import { UserInfo } from "@/store/User";
import { OrderParams, OrderResult, OrderStatus } from "@/components/Billing";

interface ReuqestOptions extends Omit<Options, "url" | "method"> {
    silent?: boolean;
}

class HttpService extends Client {
    constructor() {
        super();

        this.responsePlugins.push((res: Response, next: () => void) => {
            const { status, data, statusText, config } = res;
            const {
                message: msg,
                data: resData,
                status: successStatus,
            } = (data as unknown as SendResponseOptions) || {};
            const isSuccess = status === 200 && successStatus === "success";

            if (!isSuccess) {
                if (!config.silent) {
                    if (msg) {
                        message.error(msg);
                    } else if (statusText) {
                        message.error(`${status} ${statusText}`);
                    }
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

    fetchChatAPIProgress(body: any, options: ReuqestOptions) {
        return this.post("/api/chat-progress", body, options);
    }

    login(body: LoginInfo) {
        return this.post("/api/v1/user/login", body) as Promise<string>;
    }

    logout() {
        return this.post("/api/logout");
    }

    sendCode(body: { email: string }) {
        return this.post("/api/v1/user/verify/send_code", body);
    }

    register(body: RegisterInfo) {
        return this.post("/api/v1/user/register", body) as Promise<string>;
    }

    getUserInfo() {
        return this.get("/api/v1/user/profile") as Promise<UserInfo>;
    }

    getNotice() {
        return this.get("/api/notice") as Promise<string>;
    }

    recharget(body: { key: string }) {
        return this.post("/api/v1/integral/recharge", body);
    }

    createOrder(body: OrderParams) {
        return this.post("/api/v1/pay/pre_create", body) as Promise<OrderResult>;
    }

    checkOrder(orderId: number) {
        return this.get("/api/v1/pay/status", { orderId }) as Promise<OrderStatus>;
    }
}

const http = new HttpService();
export default http;

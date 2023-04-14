import { IncomingMessage } from "http";
import fetch, { RequestInit } from "node-fetch";
import logger from "./logger";

export interface SendResponseOptions {
    status: "success" | "fail";
    message?: string;
    data?: any;
    code?: number;
}

export interface RPCResponse {
    code: number;
    data: any;
    msg: string;
}

export const sendResponse = (options: SendResponseOptions) => {
    if (options.status === "success") {
        return Promise.resolve({
            message: options.message ?? null,
            data: options.data ?? null,
            status: options.status,
            code: options.code || 0,
        });
    }

    return Promise.reject({
        message: options.message ?? "fail",
        data: options.data ?? null,
        status: options.status,
        code: options.code || 0,
    });
};

export const convertResponseKey = (obj: Object): Object => {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => convertResponseKey(item));
    }

    if (typeof obj === "object") {
        const newObj: { [key: string]: any } = {};

        Object.entries(obj).forEach(([key, value]) => {
            const newKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
            newObj[newKey] = convertResponseKey(value);
        });

        return newObj;
    }

    return obj;
};

export const convertRequestKey = (obj: Object): Object => {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => convertRequestKey(item));
    }

    if (typeof obj === "object") {
        const newObj: { [key: string]: any } = {};

        Object.entries(obj).forEach(([key, value]) => {
            const newKey = key.replace(/([A-Z])/g, (_, letter) => `_${letter.toLowerCase()}`);
            newObj[newKey] = convertRequestKey(value);
        });

        return newObj;
    }

    return obj;
};

export const getAuthHeader = (req: IncomingMessage) => {
    const cookie = req?.headers.cookie || "";
    const cookies = cookie.split(";");
    const authCookie = cookies.find((item) => item.includes("authorization"));
    const authorization = authCookie?.trim().split("=")[1];
    return {
        Authorization: `Bearer ${authorization}`,
    };
};

export const fetchServer = async (url: string, req: IncomingMessage, options?: RequestInit) => {
    logger.info("fetch-server", url, options);

    try {
        const res = await fetch(new URL(url, process.env.BACKEND_ENDPOINT), {
            headers: getAuthHeader(req),
            method: req.method,
            ...options,
        });
        const { data, code, msg } = (await res.json()) as RPCResponse;

        logger.info("fetch-server", "rpc-response:", { data, code, msg });

        if (code !== 0) {
            return sendResponse({ status: "fail", message: msg, code });
        }

        const newData = convertResponseKey(data);
        return sendResponse({ status: "success", data: newData, message: msg });
    } catch (error) {
        logger.error("fetch-server", "rpc-response error:", error);

        const message = (error as { message: string })?.message ?? JSON.stringify(error);
        return sendResponse({ status: "fail", message, code: 500 });
    }
};

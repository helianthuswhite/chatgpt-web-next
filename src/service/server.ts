import { IncomingHttpHeaders } from "http";

export interface SendResponseOptions {
    status: "success" | "fail";
    message?: string;
    data?: any;
}

export const sendResponse = (options: SendResponseOptions) => {
    if (options.status === "success") {
        return Promise.resolve({
            message: options.message ?? null,
            data: options.data ?? null,
            status: options.status,
        });
    }

    return Promise.reject({
        message: options.message ?? "fail",
        data: options.data ?? null,
        status: options.status,
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

export const fetchServer = async (
    url: string,
    req: { headers: IncomingHttpHeaders },
    options?: RequestInit
) => {
    const cookie = req?.headers.cookie || "";
    const cookies = cookie.split(";");
    const authCookie = cookies.find((item) => item.includes("authorization"));
    const authorization = authCookie?.trim().split("=")[1];

    const res = await fetch(new URL(url, process.env.BACKEND_ENDPOINT), {
        headers: {
            Authorization: `Bearer ${authorization}`,
        },
        ...options,
    });
    const { data, code, msg } = await res.json();

    if (code !== 0) {
        throw Error(msg);
    }

    return convertResponseKey(data);
};

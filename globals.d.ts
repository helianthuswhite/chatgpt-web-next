declare global {
    namespace NodeJS {
        interface ProcessEnv {
            TIMEOUT_MS: string;
            OPENAI_API_KEY: string;
            OPENAI_ACCESS_TOKEN: string;
            OPENAI_API_BASE_URL: string;
            OPENAI_API_MODEL: string;
            SOCKS_PROXY_HOST: string;
            SOCKS_PROXY_PORT: string;
            API_REVERSE_PROXY: string;
            LOCAL_ACCESS_TOKENS: string;
            BACKEND_ENDPOINT: string;
        }
    }

    interface Window {
        umami: any;
    }
}

export {};

import "@/styles/globals.css";
import "@/styles/highlight.scss";
import "@/styles/github-markdown.scss";
import "katex/dist/katex.min.css";
import "@/styles/text.scss";
import type { AppProps } from "next/app";
import AppStoreProvider from "@/store/App";
import UserStoreProvider from "@/store/User";
import { ConfigProvider } from "antd";
import Script from "next/script";

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: "#3050fb",
                    colorLink: "#3050fb",
                    colorInfo: "#3050fb",
                    colorInfoHover: "#5978ff",
                },
            }}
        >
            <AppStoreProvider>
                <UserStoreProvider>
                    <Component {...pageProps} />
                    <Script
                        async
                        src="https://chatalpha-umami.zeabur.app/script.js"
                        data-website-id="ecbe897f-e1ef-4e3e-8179-cc3bb9a5944c"
                    />
                </UserStoreProvider>
            </AppStoreProvider>
        </ConfigProvider>
    );
}

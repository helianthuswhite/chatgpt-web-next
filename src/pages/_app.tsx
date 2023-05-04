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

ConfigProvider.config({
    theme: {
        primaryColor: "#3050fb",
    },
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AppStoreProvider>
            <UserStoreProvider>
                <Component {...pageProps} />
                <Script
                    async
                    src="https://analytics.umami.is/script.js"
                    data-website-id="04dea4d2-4a63-4984-8918-9d030fc17e60"
                />
            </UserStoreProvider>
        </AppStoreProvider>
    );
}

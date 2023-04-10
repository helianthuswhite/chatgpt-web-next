import "@/styles/globals.css";
import "@/styles/highlight.scss";
import "@/styles/github-markdown.scss";
import "katex/dist/katex.min.css";
import "@/styles/text.scss";
import type { AppProps } from "next/app";
import AppStoreProvider from "@/store/App";
import UserStoreProvider from "@/store/User";
import { ConfigProvider } from "antd";

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
            </UserStoreProvider>
        </AppStoreProvider>
    );
}

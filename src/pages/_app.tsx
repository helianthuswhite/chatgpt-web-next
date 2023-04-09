import "@/styles/globals.css";
import "@/styles/highlight.scss";
import "@/styles/github-markdown.scss";
import "katex/dist/katex.min.css";
import "@/styles/text.scss";
import type { AppProps } from "next/app";
import { ConfigProvider } from "antd";
import useIsMobile from "@/hooks/useIsMobile";

ConfigProvider.config({
    theme: {
        primaryColor: "#3050fb",
    },
});

export default function App({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

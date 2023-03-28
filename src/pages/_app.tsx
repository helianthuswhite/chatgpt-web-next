import "@/styles/globals.css";
import "@/styles/highlight.scss";
import "@/styles/github-markdown.scss";
import "katex/dist/katex.min.css";
import "@/styles/text.scss";
import AppStoreProvider from "@/store/App";
import UserStoreProvider from "@/store/User";
import ChatStoreProvider from "@/store/Chat";
import type { AppProps } from "next/app";
import { Layout, ConfigProvider } from "antd";
import classNames from "classnames";
import useIsMobile from "@/hooks/useIsMobile";
import Sidebar from "@/components/Sidebar";

ConfigProvider.config({
    theme: {
        primaryColor: "#3050fb",
    },
});

export default function App({ Component, pageProps }: AppProps) {
    const isMobile = useIsMobile();

    return (
        <AppStoreProvider>
            <UserStoreProvider>
                <ChatStoreProvider>
                    <div
                        className={classNames(
                            "h-full",
                            "dark:bg-[#24272e]",
                            "transition-all",
                            isMobile ? "p-0" : "p-4"
                        )}
                    >
                        <div
                            className={classNames(
                                "h-full",
                                "border-gray-200",
                                "border-solid",
                                "overflow-hidden",
                                isMobile
                                    ? ["rounded-none", "shadow-none", "border-none"]
                                    : [
                                          "border",
                                          "rounded-md",
                                          "shadow-md",
                                          "dark:border-neutral-800",
                                      ]
                            )}
                        >
                            <Layout className={classNames("z-40", "h-full", "transition")} hasSider>
                                <Sidebar />
                                <Layout.Content className="h-full bg-white">
                                    <Component {...pageProps} />
                                </Layout.Content>
                            </Layout>
                        </div>
                        {/* <Permission :visible="needPermission" /> */}
                    </div>
                </ChatStoreProvider>
            </UserStoreProvider>
        </AppStoreProvider>
    );
}

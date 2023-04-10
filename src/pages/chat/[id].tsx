import ChatStoreProvider from "@/store/Chat";
import { Layout } from "antd";
import classNames from "classnames";
import useIsMobile from "@/hooks/useIsMobile";
import Sidebar from "@/components/Sidebar";
import ChatContent from "./Content";

const ChatPage = () => {
    const isMobile = useIsMobile();

    return (
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
                            : ["border", "rounded-md", "shadow-md", "dark:border-neutral-800"]
                    )}
                >
                    <Layout className={classNames("z-40", "h-full", "transition")} hasSider>
                        <Sidebar />
                        <Layout.Content className="h-full bg-white">
                            <ChatContent />
                        </Layout.Content>
                    </Layout>
                </div>
            </div>
        </ChatStoreProvider>
    );
};

export default ChatPage;

import ChatStoreProvider from "@/store/Chat";
import { Layout } from "antd";
import classNames from "classnames";
import useIsMobile from "@/hooks/useIsMobile";
import Sidebar from "@/components/Sidebar";
import ChatContent from "@/components/ChatContent";
import { NextPageContext } from "next";
import { UserInfo, UserStore } from "@/store/User";
import { useContext, useEffect } from "react";
import { fetchServer, SendResponseOptions } from "@/service/server";
import { USER_TOKEN } from "@/constants";

interface Props {
    userInfo?: UserInfo;
}

const ChatPage: React.FC<Props> = ({ userInfo }) => {
    const isMobile = useIsMobile();
    const { userInfo: originUserInfo, setUserInfo } = useContext(UserStore);

    useEffect(() => {
        setUserInfo({
            ...originUserInfo,
            name: userInfo?.nickName || originUserInfo.name,
            avatar: userInfo?.avatar || originUserInfo.avatar,
            email: userInfo?.email || originUserInfo.email,
            inviteCode: userInfo?.inviteCode || "",
            integral: userInfo?.integral || 0,
        });
    }, [userInfo]);

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

export async function getServerSideProps({ req, res }: NextPageContext) {
    const cookie = req?.headers.cookie;

    if (!cookie) {
        return {
            props: {},
        };
    }

    try {
        const { data: userInfo } = await fetchServer("/api/v1/user/profile", req);
        return {
            props: {
                userInfo,
            },
        };
    } catch (error) {
        //  if get user info failed, redirect to login page
        if (res) {
            res.setHeader("Set-Cookie", `${USER_TOKEN}=; path=/; Max-Age=0; HttpOnly`);
            res.writeHead(301, { Location: "/login" });
            res.end();
        }

        return {
            props: {},
        };
    }
}

export default ChatPage;

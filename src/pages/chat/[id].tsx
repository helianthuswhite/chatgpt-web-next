import ChatStoreProvider from "@/store/Chat";
import { Alert, Checkbox, Layout, Modal } from "antd";
import classNames from "classnames";
import useIsMobile from "@/hooks/useIsMobile";
import Sidebar from "@/components/Sidebar";
import ChatContent from "@/components/ChatContent";
import { NextPageContext } from "next";
import { UserInfo, UserStore } from "@/store/User";
import { useContext, useEffect, useState } from "react";
import { fetchServer } from "@/service/server";
import { USER_TOKEN } from "@/constants";
import { AppStore } from "@/store/App";
import Button from "@/components/Button";

interface Props {
    userInfo?: UserInfo;
    notice?: string;
}

const ChatPage: React.FC<Props> = ({ userInfo, notice }) => {
    const isMobile = useIsMobile();
    const { userInfo: originUserInfo, setUserInfo } = useContext(UserStore);
    const { setNotice, noNotice, setData } = useContext(AppStore);
    const [showNotice, setShowNotice] = useState(false);

    useEffect(() => {
        setUserInfo({
            ...originUserInfo,
            name: userInfo?.nickName || originUserInfo.name,
            avatar: userInfo?.avatar || originUserInfo.avatar,
            email: userInfo?.email || originUserInfo.email,
            inviteCode: userInfo?.inviteCode || "",
            integral: userInfo?.integral || 0,
            vipUser: userInfo?.vipUser || false,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userInfo]);

    useEffect(() => {
        if (notice) {
            setNotice(notice);

            if (!noNotice) {
                setShowNotice(true);
            }
        }
    }, [notice, noNotice]);

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
            <Modal footer={null} closable={false} open={showNotice} width={600}>
                <Alert
                    className="mb-4"
                    description={<div dangerouslySetInnerHTML={{ __html: notice || "" }} />}
                    type="success"
                />
                <div className="flex items-center justify-end">
                    <Checkbox
                        checked={noNotice}
                        onChange={(e) => setData({ noNotice: e.target.checked })}
                    >
                        不再弹出
                    </Checkbox>
                    <Button type="primary" className="ml-4" onClick={() => setShowNotice(false)}>
                        我知道了
                    </Button>
                </div>
            </Modal>
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
                notice: process.env.NOTICE,
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

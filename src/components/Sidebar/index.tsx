import { Button, Layout, List } from "antd";
import { useContext } from "react";
import useIsMobile from "@/hooks/useIsMobile";
import { AppStore } from "@/store/App";
import History from "./History";
import Footer from "./Footer";
import useTheme from "@/hooks/useTheme";
import Scrollbar from "@/components/Scrollbar";
import { ChatStore, DEFAULT_TITLE } from "@/store/Chat";
import { useRouter } from "next/router";
import { LeftOutlined } from "@ant-design/icons";
import classNames from "classnames";

interface Props {}

const Sidebar: React.FC<Props> = () => {
    const { sidebarCollapsed, setData, setSidebarCollapsed } = useContext(AppStore);
    const isMobile = useIsMobile();
    const theme = useTheme();
    const router = useRouter();
    const { history, addHistory } = useContext(ChatStore);

    const onAddHistory = () => {
        const uuid = Date.now();
        addHistory({ title: DEFAULT_TITLE, uuid });
        router.push(`/chat/${uuid}`);
    };

    return (
        <>
            <Layout.Sider
                collapsed={sidebarCollapsed}
                collapsedWidth={0}
                width={260}
                style={
                    isMobile
                        ? {
                              position: "fixed",
                              top: 0,
                              bottom: 0,
                              zIndex: 50,
                          }
                        : {}
                }
                theme={theme}
                trigger={null}
                className={classNames(
                    "border-0 border-gray-200 border-solid",
                    !sidebarCollapsed && "border-r"
                )}
            >
                <div
                    className="flex flex-col h-full"
                    style={
                        isMobile
                            ? {
                                  paddingBottom: "env(safe-area-inset-bottom)",
                              }
                            : {}
                    }
                >
                    <main className="flex flex-col flex-1 min-h-0">
                        <div className="p-4">
                            <Button type="dashed" block onClick={onAddHistory}>
                                New chat
                            </Button>
                        </div>
                        <div className="flex-1 min-h-0 pb-4 overflow-hidden">
                            <Scrollbar>
                                {history.length ? (
                                    <List
                                        className="px-4"
                                        dataSource={history}
                                        renderItem={(item) => <History {...item} />}
                                    />
                                ) : (
                                    <div className="flex flex-col items-center mt-4 text-center text-neutral-300">
                                        {/* <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" /> */}
                                        <span>暂无数据</span>
                                    </div>
                                )}
                            </Scrollbar>
                        </div>
                    </main>
                    <Footer />
                </div>
                <Button
                    className={classNames(
                        "absolute top-1/2 -right-3 -mt-1 text-xs flex items-center justify-center border shadow-l",
                        "bg-white text-gray-400 border-gray-200 hover:bg-white focus:bg-white ",
                        "hover:text-gray-400 focus:text-gray-400 focus:border-gray-200 z-10"
                    )}
                    size="small"
                    type="text"
                    shape="circle"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                    <LeftOutlined
                        className={classNames(
                            sidebarCollapsed ? "rotate-180" : "",
                            "leading-1",
                            "h-3"
                        )}
                    />
                </Button>
            </Layout.Sider>
            {isMobile && !sidebarCollapsed && (
                <div
                    className="fixed inset-0 z-40 bg-black/40"
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            )}
        </>
    );
};

export default Sidebar;

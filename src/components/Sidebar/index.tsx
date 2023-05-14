import { Button, Dropdown, Layout, List } from "antd";
import { useContext, useRef, useState } from "react";
import useIsMobile from "@/hooks/useIsMobile";
import History from "./History";
import Footer from "./Footer";
import useTheme from "@/hooks/useTheme";
import Scrollbar from "@/components/Scrollbar";
import { ChatStore, DEFAULT_TITLE } from "@/store/Chat";
import { useRouter } from "next/router";
import { LeftOutlined, PlusOutlined } from "@ant-design/icons";
import classNames from "classnames";
import DragLine from "@/components/DragLine";
import Icon from "@/components/Icon";

interface Props {}

const Sidebar: React.FC<Props> = () => {
    const isMobile = useIsMobile();
    const theme = useTheme();
    const router = useRouter();
    const originWidth = useRef(300);
    const { history, addHistory } = useContext(ChatStore);
    const [width, setWidth] = useState(300);
    const [isDragging, setIsDragging] = useState(false);

    const onAddHistory = () => {
        const uuid = Date.now();
        addHistory({ title: DEFAULT_TITLE, uuid });
        router.push(`/chat/${uuid}`);
    };

    const onCollapse = () => {
        if (width) {
            originWidth.current = width;
        }
        setWidth(width ? 0 : originWidth.current);
    };

    return (
        <div className="relative">
            <Layout.Sider
                width={width}
                style={
                    isMobile
                        ? {
                              position: "fixed",
                              top: 0,
                              bottom: 0,
                              zIndex: 50,
                          }
                        : isDragging
                        ? { transition: "none" }
                        : {}
                }
                theme={theme}
                trigger={null}
                className="h-full"
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
                    <h2 className="text-sm m-4 mb-2 ml-6">全部对话（5）</h2>
                    <div className="flex-1 min-h-0 overflow-hidden">
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
                    <div className="p-4">
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        label: "从广场导入",
                                        key: "import",
                                        icon: <Icon type="icon-daoru" />,
                                    },
                                ],
                            }}
                        >
                            <Button block onClick={onAddHistory}>
                                <PlusOutlined />
                                新对话
                            </Button>
                        </Dropdown>
                    </div>
                    {/* <Footer /> */}
                </div>
                <Button
                    className={classNames(
                        "absolute top-1/2 -right-3 -mt-1 text-xs flex items-center justify-center border shadow-l",
                        "bg-white text-gray-400 border-gray-200 hover:bg-white focus:bg-white ",
                        "hover:text-gray-400 focus:text-gray-400 focus:border-gray-200 z-20"
                    )}
                    size="small"
                    type="text"
                    shape="circle"
                    onClick={onCollapse}
                >
                    <LeftOutlined
                        className={classNames(width ? "" : "rotate-180", "leading-1", "h-3")}
                    />
                </Button>
            </Layout.Sider>
            <DragLine
                leftWidth={width}
                minWidth={300}
                maxWidth={500}
                onChangeWidth={setWidth}
                onStart={() => setIsDragging(true)}
                onStop={() => setIsDragging(false)}
            />
            {isMobile && width && (
                <div className="fixed inset-0 z-40 bg-black/40" onClick={onCollapse} />
            )}
        </div>
    );
};

export default Sidebar;

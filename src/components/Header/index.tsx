import { AppStore } from "@/store/App";
import { useContext, useRef } from "react";
import Button from "@/components/Button";
import { DownloadOutlined, MenuUnfoldOutlined, ProfileOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { message } from "antd";
import { DEFAULT_TITLE } from "@/store/Chat";
import downloadAsImage from "@/utils/downloadAsImage";

interface Props {
    title?: string;
    scrollToTop?: () => void;
}

const Header: React.FC<Props> = ({ title, scrollToTop }) => {
    const clickCount = useRef(0);
    const { sidebarCollapsed, hasContext, setData, setSidebarCollapsed } = useContext(AppStore);

    const onCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

    const onTitleClick = () => {
        clickCount.current += 1;
        setTimeout(() => {
            if (clickCount.current === 2) {
                scrollToTop?.();
            }
            clickCount.current = 0;
        }, 300);
    };

    const onChangeContext = () => {
        setData({ hasContext: !hasContext });
        message.success("当前会话已" + (hasContext ? "关闭" : "开启") + "上下文");
    };

    const onDownload = () => {
        const dom = document.querySelector("#image-wrapper") as HTMLElement;
        if (dom) {
            downloadAsImage(dom, (title || DEFAULT_TITLE).substring(0, 10));
        }
    };

    return (
        <header
            className={classNames(
                "sticky top-0 left-0 right-0 z-30 border-0 border-b border-solid border-gray-200",
                "dark:border-neutral-800 bg-white/80 dark:bg-black/20 backdrop-blur"
            )}
        >
            <div className="relative flex items-center justify-between min-w-0 overflow-hidden h-12">
                <div className="flex items-center">
                    <Button
                        className="flex items-center justify-center text-xl"
                        onClick={onCollapse}
                        type="text"
                    >
                        <MenuUnfoldOutlined />
                    </Button>
                </div>
                <span
                    className="flex-1 pr-6 overflow-hidden cursor-pointer select-none text-ellipsis whitespace-nowrap"
                    onClick={onTitleClick}
                >
                    {title}
                </span>
                <div className="flex items-center">
                    <Button
                        type="text"
                        shape="circle"
                        className={classNames(
                            "flex items-center justify-center text-lg hover:text-[#3050fb]",
                            hasContext && "text-[#3050fb] focus:text-[#3050fb]"
                        )}
                        onClick={onChangeContext}
                    >
                        <ProfileOutlined />
                    </Button>
                    <Button
                        type="text"
                        shape="circle"
                        className="flex items-center justify-center text-lg mr-2"
                        onClick={onDownload}
                    >
                        <DownloadOutlined />
                    </Button>
                </div>
            </div>
        </header>
    );
};

export default Header;

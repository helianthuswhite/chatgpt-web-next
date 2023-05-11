import { AppStore } from "@/store/App";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import Button from "@/components/Button";
import { GlobalOutlined } from "@ant-design/icons";
import classNames from "classnames";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Avatar, Dropdown } from "antd";
import { UserStore } from "@/store/User";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import Icon from "@/components/Icon";
import Link from "next/link";

interface Props {
    title?: string;
    scrollToTop?: () => void;
}

const avatarMenuItems: MenuItemType[] = [
    {
        label: "个人中心",
        key: "setting",
    },
    {
        label: "退出登录",
        key: "logout",
    },
];

const languageMenuItems: MenuItemType[] = [
    {
        label: "🇨🇳 简体中文",
        key: "zh-CN",
    },
];

const Header: React.FC<Props> = ({ title, scrollToTop }) => {
    const clickCount = useRef(0);
    const pathname = usePathname();
    const { userInfo } = useContext(UserStore);
    const { sidebarCollapsed, hasContext, setData, setSidebarCollapsed } = useContext(AppStore);
    const [navMenuKey, setNavMenuKey] = useState<string>("explore");
    const navMenuItems = useMemo(
        () => [
            {
                label: "探索",
                key: "explore",
                icon: <Icon type="icon-explore" />,
            },
            {
                label: "对话",
                key: "chat",
                icon: <Icon type="icon-chat" />,
            },
            {
                label: "广场",
                key: "prompts",
                icon: <Icon type="icon-store" />,
                chilren: [
                    {
                        label:
                            pathname === "/prompts/chat" ? (
                                <span className="text-[#3050fb]">智能对话</span>
                            ) : (
                                <Link href="prompts/chat">智能对话</Link>
                            ),
                        key: "chat-prompts",
                    },
                    {
                        label:
                            pathname === "/prompts/gallery" ? (
                                <span className="text-[#3050fb]">图画集</span>
                            ) : (
                                <Link href="prompts/gallery">图画集</Link>
                            ),
                        key: "image-prompts",
                    },
                ],
            },
            {
                label: "创作者",
                key: "create",
                icon: <Icon className="text-red-500" type="icon-money" />,
            },
        ],
        [pathname]
    );

    console.log(pathname);

    useEffect(() => {
        const pathKey = pathname.split("/")[1];
        setNavMenuKey(pathKey);
    }, [pathname]);

    const renderNavButton = (item: MenuItemType) => (
        <Button key={item.key} type={navMenuKey === item.key ? "link" : "text"}>
            {item.icon}
            {item.label}
        </Button>
    );

    return (
        <header
            className={classNames(
                "border-0 border-b border-solid border-gray-100 dark:border-neutral-800 bg-white/80 ",
                "dark:bg-black/20 flex items-center justify-between h-16"
            )}
        >
            <div className="flex items-center ml-10">
                <Image width={36} height={36} src="/logo.svg" alt="logo" />
                <span className="font-bold ml-3 mr-4">ChatAlpha</span>
                {navMenuItems.map((item) =>
                    item.chilren ? (
                        <Dropdown key={item.key} menu={{ items: item.chilren }}>
                            {renderNavButton(item)}
                        </Dropdown>
                    ) : navMenuKey === item.key ? (
                        renderNavButton(item)
                    ) : (
                        <Link key={item.key} href={item.key}>
                            {renderNavButton(item)}
                        </Link>
                    )
                )}
            </div>
            <div className="flex items-center mr-10 cursor-pointer">
                <Dropdown placement="topRight" menu={{ items: languageMenuItems }}>
                    <Button className="mr-2" type="text">
                        <GlobalOutlined className="text-gray-600" />
                    </Button>
                </Dropdown>
                <Dropdown menu={{ items: avatarMenuItems }}>
                    <Avatar src={userInfo.avatar} />
                </Dropdown>
            </div>
        </header>
    );
};

export default Header;

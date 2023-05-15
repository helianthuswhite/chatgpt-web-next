import { useContext, useEffect, useMemo, useState } from "react";
import Button from "@/components/Button";
import {
    CloseCircleFilled,
    GithubOutlined,
    GlobalOutlined,
    MessageOutlined,
} from "@ant-design/icons";
import classNames from "classnames";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Avatar, Dropdown, Popover, Tooltip } from "antd";
import { UserStore } from "@/store/User";
import { MenuItemType } from "antd/es/menu/hooks/useItems";
import Icon from "@/components/Icon";
import Link from "next/link";

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

const Billboard: React.FC = () => {
    const pathname = usePathname();
    const { userInfo } = useContext(UserStore);
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
                icon: <MessageOutlined style={{ transform: "rotateY(180deg)" }} />,
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

    const onGotoGithub = () => window.open(`https://github.com/helianthuswhite/chatgpt-web-next`);

    return (
        <div
            className={classNames(
                "bg-gradient-to-r from-[#3050fb] via-purple-500 to-indigo-500",
                "text-white text-center py-3 relative text-sm"
            )}
        >
            注册即送50次对话次数，每成功邀请一个新用户还可额外获得20次。此外，我们支持其他方式获取次数，可扫描
            <Popover
                content={
                    <Image
                        width="150"
                        height="150"
                        alt="二维码"
                        src="https://chatalpha.oss-cn-beijing.aliyuncs.com/join_group.jpeg?x-bce-process=style/scale"
                    />
                }
                className="text-[#3050fb] cursor-pointer underline"
            >
                二维码
            </Popover>
            加入用户群以获取更多帮助。
            <Button type="text" shape="circle" className="absolute right-2 top-1">
                <CloseCircleFilled className="text-lg text-gray-50 opacity-50 hover:opacity-100" />
            </Button>
        </div>
    );
};

export default Billboard;

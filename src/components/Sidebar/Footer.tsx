import { Badge } from "antd";
import classNames from "classnames";
import { SettingOutlined, SoundFilled } from "@ant-design/icons";
import UserAvatar from "@/components/UserAvatar";
import Button from "@/components/Button";
import Setting from "@/components/Setting";
import { useContext, useState } from "react";
import { AppStore } from "@/store/App";
import ClientOnly from "@/components/ClientOnly";

const Footer: React.FC = () => {
    const [settingOpen, setSettingOpen] = useState(false);
    const { notice } = useContext(AppStore);

    return (
        <footer
            className={classNames(
                "items-center",
                "justify-between",
                "min-w-0",
                "p-4",
                "overflow-hidden",
                "border-0",
                "border-t",
                "dark:border-neutral-800",
                "flex",
                "border-solid",
                "border-gray-200"
            )}
        >
            <div className="flex-1 flex-shrink-0 overflow-hidden">
                <UserAvatar />
            </div>
            <ClientOnly>
                <Badge
                    count={notice ? <SoundFilled className="text-red-500 animate-pulse" /> : null}
                >
                    <Button
                        type="text"
                        shape="circle"
                        className="flex text-xl text-[#4f555e] dark:text-white justify-center"
                        onClick={() => setSettingOpen(true)}
                    >
                        <SettingOutlined />
                    </Button>
                </Badge>
            </ClientOnly>
            <Setting open={settingOpen} notice={notice} onCancel={() => setSettingOpen(false)} />
        </footer>
    );
};

export default Footer;

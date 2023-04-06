import { Tooltip } from "antd";
import classNames from "classnames";
import { SettingOutlined } from "@ant-design/icons";
import UserAvatar from "@/components/UserAvatar";
import Button from "@/components/Button";
import Setting from "@/components/Setting";
import { useState } from "react";

const Footer: React.FC = () => {
    const [settingOpen, setSettingOpen] = useState(false);

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
            <Tooltip title="设置">
                <Button
                    type="text"
                    shape="circle"
                    className="flex text-xl text-[#4f555e] dark:text-white justify-center"
                    onClick={() => setSettingOpen(true)}
                >
                    <SettingOutlined />
                </Button>
            </Tooltip>
            <Setting open={settingOpen} onCancel={() => setSettingOpen(false)} />
        </footer>
    );
};

export default Footer;

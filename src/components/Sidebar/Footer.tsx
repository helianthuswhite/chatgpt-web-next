import { Avatar as AvatarComp, Layout, Tooltip } from "antd";
import { useContext } from "react";
import { UserStore } from "@/store/User";
import useIsMobile from "@/hooks/useIsMobile";
import { AppStore } from "@/store/App";
import Scrollbar from "@/components/Scrollbar";
import classNames from "classnames";
import Avatar from "@/components/Avatar";
import { SettingOutlined } from "@ant-design/icons";
import UserAvatar from "@/components/UserAvatar";
import Button from "@/components/Button";

const Footer: React.FC = () => {
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
                >
                    <SettingOutlined />
                </Button>
            </Tooltip>

            {/* <Setting v-if="show" v-model:visible="show" /> */}
        </footer>
    );
};

export default Footer;

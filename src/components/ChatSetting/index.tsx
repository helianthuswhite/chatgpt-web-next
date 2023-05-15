import { Tooltip } from "antd";
import { CloseOutlined, SettingOutlined } from "@ant-design/icons";
import Button from "@/components/Button";
import { useState } from "react";

interface Props {}

const ChatSetting: React.FC<Props> = () => {
    const [width, setWidth] = useState(60);

    return (
        <div
            className="h-full p-2 bg-[#fff] border-0 border-l border-solid border-gray-200 transition-all"
            style={{ width }}
        >
            {width === 60 ? (
                <Tooltip placement="left" title="对话设置">
                    <Button shape="circle" type="text" size="large" onClick={() => setWidth(400)}>
                        <SettingOutlined className="text-xl text-gray-500" />
                    </Button>
                </Tooltip>
            ) : (
                <Button shape="circle" type="text" onClick={() => setWidth(60)}>
                    <CloseOutlined className=" text-gray-500" />
                </Button>
            )}
        </div>
    );
};

export default ChatSetting;

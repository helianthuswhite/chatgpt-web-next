import { Form, Input, Select, Slider, Switch, Tabs, Tooltip, Upload } from "antd";
import {
    CameraFilled,
    CameraOutlined,
    CloseOutlined,
    EditOutlined,
    SettingOutlined,
} from "@ant-design/icons";
import Button from "@/components/Button";
import { useState } from "react";
import Avatar from "../Avatar";
import classNames from "classnames";

interface Props {}

const modelOptions = [
    {
        label: "gpt-3.5-turbo",
        value: "gpt-3.5-turbo",
    },
    {
        label: "gpt-3.5-turbo-0301",
        value: "gpt-3.5-turbo-0301",
    },
];

const ChatSetting: React.FC<Props> = () => {
    const [width, setWidth] = useState(50);
    const [editTitle, setEditTitle] = useState(false);
    const [editDesc, setEditDesc] = useState(false);
    const isCollapsed = width === 50;

    return (
        <div
            className="h-full bg-white border-0 border-l border-solid border-gray-200 transition-all"
            style={{ width }}
        >
            {isCollapsed ? (
                <Tooltip placement="left" title="设置">
                    <Button
                        className="m-2"
                        shape="circle"
                        type="text"
                        onClick={() => setWidth(400)}
                    >
                        <SettingOutlined className="text-lg text-gray-500" />
                    </Button>
                </Tooltip>
            ) : (
                <>
                    <div className="flex items-center p-2">
                        <Button shape="circle" type="text" onClick={() => setWidth(50)}>
                            <CloseOutlined className=" text-gray-500" />
                        </Button>
                        <h2 className="text-sm m-0 ml-2">设置</h2>
                    </div>
                    <div className="flex items-center flex-col mx-4 mb-2">
                        <Upload>
                            <div className="relative w-16 h-16 rounded-full overflow-hidden mt-4">
                                <Avatar className="h-full w-full" isUser />
                                <div
                                    className={classNames(
                                        "absolute cursor-pointer flex justify-center w-full h-full",
                                        "bg-gray-200 bg-[#0000004c] bottom-0"
                                    )}
                                >
                                    <CameraFilled className="text-xl text-white" />
                                </div>
                            </div>
                        </Upload>
                        {editTitle ? (
                            <Input className="m-2" onBlur={() => setEditTitle(false)} />
                        ) : (
                            <h2
                                className="text-base m-2 cursor-text group"
                                onClick={() => setEditTitle(true)}
                            >
                                这是标题
                                <EditOutlined className="ml-2 hidden group-hover:inline" />
                            </h2>
                        )}
                        {editDesc ? (
                            <Input.TextArea className="text-xs" onBlur={() => setEditDesc(false)} />
                        ) : (
                            <div
                                className="text-xs text-gray-400 group"
                                onClick={() => setEditDesc(true)}
                            >
                                暂无对话介绍
                                <EditOutlined className="ml-2 hidden group-hover:inline" />
                            </div>
                        )}
                    </div>
                    <Tabs centered className="border-0 border-b border-gray-200">
                        <Tabs.TabPane tab="对话设置" key="1">
                            <Form
                                className="my-4 mx-8"
                                labelCol={{ span: 7 }}
                                labelAlign="left"
                                colon={false}
                            >
                                <Form.Item label="逐字返回">
                                    <Switch />
                                </Form.Item>
                                <Form.Item label="模型">
                                    <Select options={modelOptions} />
                                </Form.Item>
                                <Form.Item label="随机性" tooltip="值越大，回复越随机">
                                    <Slider min={0} max={2} step={0.1} />
                                </Form.Item>
                                <Form.Item label="话题新鲜度" tooltip="值越大，越可能扩展到新话题">
                                    <Slider min={0} max={2} step={0.1} />
                                </Form.Item>
                                <Form.Item label="附带上下文数">
                                    <Slider min={0} max={2} step={0.1} />
                                </Form.Item>
                            </Form>
                        </Tabs.TabPane>
                    </Tabs>
                </>
            )}
        </div>
    );
};

export default ChatSetting;

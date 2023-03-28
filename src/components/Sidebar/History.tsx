import { useContext, useState } from "react";
import classNames from "classnames";
import { Input, Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, MessageOutlined, SaveOutlined } from "@ant-design/icons";
import Button from "@/components/Button";
import { ChatStore } from "@/store/Chat";
import { useRouter } from "next/router";

interface Props {
    title: string;
    uuid: number;
}

const History: React.FC<Props> = ({ uuid, title }) => {
    const { active, history, deleteHistory, updateHistory } = useContext(ChatStore);
    const [isEdit, setIsEdit] = useState(false);
    const [value, setValue] = useState(title);
    const router = useRouter();

    const onEditOk = () => {
        updateHistory({ uuid, title: value });
        setIsEdit(false);
    };

    const onHistoryClick = () => {
        router.push(`/chat/${uuid}`);
    };

    const onDelete = () => {
        deleteHistory(uuid);

        const firstHistory = history.filter((item) => item.uuid !== uuid)[0];
        setTimeout(() => router.push(`/chat/${firstHistory.uuid}`), 0);
    };

    return (
        <Button
            className={classNames(
                "relative",
                "flex",
                "items-center",
                "space-x-0",
                "w-full",
                "h-10",
                "pr-12",
                "break-all",
                "rounded-md",
                "mb-2",
                "dark:border-neutral-800",
                "dark:hover:bg-[#24272e]",
                active === uuid && ["text-[#3050fb]", "border-[#3050fb]"]
            )}
            onClick={onHistoryClick}
        >
            <MessageOutlined className="mr-2" style={{ transform: "rotateY(180deg)" }} />
            <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                {isEdit ? (
                    <Input
                        value={value}
                        className="text-xs h-full p-1"
                        size="small"
                        autoFocus
                        onChange={(e) => setValue(e.target.value)}
                        onPressEnter={onEditOk}
                    />
                ) : (
                    <span>{title}</span>
                )}
            </div>
            {active === uuid && (
                <div className="absolute z-10 flex right-2">
                    {isEdit ? (
                        <span
                            className="ant-btn ant-btn-text flex items-center p-0 h-4"
                            style={{ color: "#3050fb" }}
                            onClick={onEditOk}
                        >
                            <SaveOutlined />
                        </span>
                    ) : (
                        <>
                            <span
                                className="ant-btn ant-btn-text flex items-center p-0 h-4 mr-1"
                                style={{ color: "#3050fb" }}
                                onClick={() => setIsEdit(true)}
                            >
                                <EditOutlined />
                            </span>
                            {history.length !== 1 && (
                                <Popconfirm
                                    title="确定删除此记录？"
                                    cancelText="取消"
                                    okText="确认"
                                    onConfirm={onDelete}
                                >
                                    <span
                                        className="ant-btn ant-btn-text flex items-center p-0 h-4"
                                        style={{ color: "#3050fb" }}
                                    >
                                        <DeleteOutlined />
                                    </span>
                                </Popconfirm>
                            )}
                        </>
                    )}
                </div>
            )}
        </Button>
    );
};

export default History;

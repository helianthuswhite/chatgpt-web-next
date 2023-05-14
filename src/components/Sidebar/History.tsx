import { useContext, useState } from "react";
import classNames from "classnames";
import { Input, Popconfirm } from "antd";
import {
    CloseOutlined,
    DeleteOutlined,
    EditOutlined,
    MessageOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import Button from "@/components/Button";
import { ChatStore } from "@/store/Chat";
import { useRouter } from "next/router";
import Avatar from "@/components/Avatar";

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
        <div
            className={classNames(
                "flex items-center rounded-md cursor-pointer p-2 mb-2 hover:bg-gray-100",
                "dark:border-neutral-800 dark:hover:bg-[#24272e] group",
                active === uuid && ["bg-gray-100"]
            )}
            onClick={onHistoryClick}
        >
            <Avatar />
            <div className="flex-1 ml-2 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                {/* {isEdit ? (
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
                )} */}
                <div className="flex justify-between">
                    <div className="overflow-ellipsis overflow-hidden">{title}</div>
                    <span className="text-xs leading-[1.75] text-gray-400 ml-2 group-hover:hidden">
                        5月14日
                    </span>
                </div>
                <div
                    className={classNames(
                        "text-xs pr-4 overflow-ellipsis overflow-hidden text-gray-400",
                        "group-hover:pr-0"
                    )}
                >
                    这是最后一句话的数据这是最后一句话的数据
                </div>
            </div>
            <Popconfirm
                title="确定删除此记录？"
                cancelText="取消"
                okText="确认"
                onConfirm={(e) => {
                    e?.stopPropagation();
                    onDelete();
                }}
                onCancel={(e) => e?.stopPropagation()}
            >
                <CloseOutlined
                    onClick={(e) => e.stopPropagation()}
                    className="items-center hidden text-gray-500 p-2 -mr-1 hover:text-[#3050fb] group-hover:flex"
                />
            </Popconfirm>
            {/* <div className="z-10 flex right-2">
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
                    </>
                )}
            </div> */}
        </div>
    );
};

export default History;

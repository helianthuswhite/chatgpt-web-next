import Avatar from "@/components/Avatar";
import Text from "@/components/Text";
import {
    CopyOutlined,
    DeleteOutlined,
    MoreOutlined,
    PictureFilled,
    ReloadOutlined,
} from "@ant-design/icons";
import { Dropdown, message } from "antd";
import Button from "@/components/Button";
import Image from "@/components/Image";
import classNames from "classnames";
import copyToClipboard from "@/utils/copyToClipboard";

interface Props {
    dateTime?: string;
    text?: string;
    inversion?: boolean;
    error?: boolean;
    loading?: boolean;
    isImage?: boolean;
    images?: string[];
    onRegenerate?: () => void;
    onDelete?: () => void;
}

const Message: React.FC<Props> = ({
    inversion,
    dateTime,
    text,
    error,
    loading,
    isImage,
    images,
    onRegenerate,
    onDelete,
}) => {
    return (
        <div
            className={classNames(
                "flex w-full mb-6 overflow-hidden",
                inversion && "flex-row-reverse"
            )}
        >
            <div
                className={classNames(
                    "flex items-center justify-center flex-shrink-0 h-8 overflow-hidden",
                    "rounded-full basis-8",
                    inversion ? "ml-2" : "mr-2"
                )}
            >
                <Avatar isUser={inversion} />
            </div>
            <div
                className={classNames(
                    `overflow-hidden text-sm`,
                    inversion ? "items-end" : "items-start"
                )}
            >
                <p
                    className={classNames(
                        `mb-1 text-xs text-gray-400`,
                        inversion ? "text-right" : "text-left"
                    )}
                >
                    {isImage && inversion ? (
                        <PictureFilled style={{ color: "#34D399", marginRight: "5px" }} />
                    ) : null}
                    {dateTime}
                </p>
                <div
                    className={classNames(
                        "flex items-end gap-1 mt-2",
                        inversion ? "flex-row-reverse" : "flex-row"
                    )}
                >
                    {isImage && !inversion ? (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <Image urls={images} loading={loading} onRegenerate={onRegenerate} />
                    ) : (
                        <Text inversion={inversion} text={text} error={error} loading={loading} />
                    )}
                    <div className="flex flex-col">
                        {!inversion && (
                            <Button
                                type="text"
                                className={classNames(
                                    "mb-1 transition text-neutral-400 hover:text-neutral-800",
                                    "flex items-center justify-center w-4 h-4 p-0 dark:hover:text-neutral-300"
                                )}
                                onClick={onRegenerate}
                            >
                                <ReloadOutlined className="text-xs" />
                            </Button>
                        )}
                        <Dropdown
                            menu={{
                                items: [
                                    {
                                        label: "复制",
                                        key: "copy",
                                        icon: <CopyOutlined />,
                                        onClick: async () => {
                                            await copyToClipboard(text || "");
                                            message.success(
                                                isImage ? "图片链接已复制到剪切板" : "复制成功"
                                            );
                                        },
                                    },
                                    {
                                        label: "删除",
                                        key: "delete",
                                        icon: <DeleteOutlined />,
                                        onClick: onDelete,
                                    },
                                ],
                            }}
                        >
                            <Button
                                type="text"
                                className={classNames(
                                    "flex transition text-neutral-400 hover:text-neutral-800",
                                    "items-center justify-center w-4 h-4 p-0 dark:hover:text-neutral-300"
                                )}
                            >
                                <MoreOutlined />
                            </Button>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;

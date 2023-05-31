import useIsMobile from "@/hooks/useIsMobile";
import Button from "@/components/Button";
import classNames from "classnames";
import { useContext, useMemo, useState } from "react";
import { DeleteOutlined, DownloadOutlined, ProfileOutlined, SendOutlined } from "@ant-design/icons";
import { Mentions, message, Modal } from "antd";
import { useRouter } from "next/router";
import { ChatStore, DEFAULT_TITLE, Model } from "@/store/Chat";
import useChatProgress from "@/hooks/useChatProgress";
import downloadAsImage from "@/utils/downloadAsImage";
import { AppStore } from "@/store/App";
import { UserStore } from "@/store/User";

interface Props {
    responding: boolean;
    onMessageUpdate: () => void;
    setResponding: (value: boolean) => void;
}

const Footer: React.FC<Props> = ({ onMessageUpdate, responding, setResponding }) => {
    const isMobile = useIsMobile();
    const router = useRouter();
    const { chat, model, history, addChat, setModel, clearChat, updateHistory } =
        useContext(ChatStore);
    const { hasContext, setData } = useContext(AppStore);
    const { userInfo } = useContext(UserStore);
    const [value, setValue] = useState("");
    const { request } = useChatProgress(responding, setResponding);
    const uuid = +(router.query.id || 0);
    const conversationList = useMemo(() => {
        return chat.find((item) => item.uuid === uuid)?.data || [];
    }, [chat, uuid]);
    const currentHistory = useMemo(() => {
        return history.find((item) => item.uuid === uuid);
    }, [history, uuid]);
    const mentionOptions = useMemo(() => {
        const options = [
            {
                label: "图片模式-Midjourney",
                value: "image$midjourney",
            },
            {
                label: "图片模式-Dalle2",
                value: "image$dall-e2",
            },
            {
                label: "图片模式-Stable Diffusion",
                value: "image$stable-diffusion",
            },
        ];

        return options;
    }, []);

    const submit = async (text: string) => {
        let message = text.trim();
        if (!message || message === "/image") return;

        const isImage = message.startsWith("/image");
        if (isImage) {
            message = message.replace("/image", "").trim();
        }

        if (currentHistory?.title && currentHistory.title === DEFAULT_TITLE) {
            updateHistory({ title: message, uuid });
        }

        addChat(uuid, {
            dateTime: new Date().toLocaleString(),
            text: message,
            inversion: true,
            isImage,
            error: false,
            conversationOptions: null,
            requestOptions: { prompt: message, options: null },
        });
        setValue("");
        onMessageUpdate();

        const responseList = conversationList.filter((item) => !item.inversion && !item.error);
        const lastContext = responseList[responseList.length - 1]?.conversationOptions;
        const options =
            lastContext && hasContext ? { ...lastContext, isImage, model } : { isImage, model };
        addChat(uuid, {
            dateTime: new Date().toLocaleString(),
            text: "",
            loading: true,
            inversion: false,
            isImage,
            model,
            error: false,
            conversationOptions: null,
            requestOptions: { prompt: message, options },
        });
        onMessageUpdate();

        //  if converationList is empty, update index should be 1, because there are two addChat method executes
        request(conversationList.length ? conversationList.length - 1 : 1, onMessageUpdate);
    };

    const onClear = () => {
        Modal.confirm({
            title: "是否清空当前会话？",
            okText: "确认",
            cancelText: "取消",
            centered: true,
            onOk: () => clearChat(uuid),
        });
    };

    const onChangeContext = () => {
        setData({ hasContext: !hasContext });
        message.success("当前会话已" + (hasContext ? "关闭" : "开启") + "上下文");
    };

    const onDownload = () => {
        const dom = document.querySelector("#image-wrapper") as HTMLElement;
        const title = currentHistory?.title || DEFAULT_TITLE;
        if (dom) {
            downloadAsImage(dom, title.substring(0, 10));
        }
    };

    const onPressEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!isMobile) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit((e.target as HTMLTextAreaElement).value);
            }
        } else {
            if (e.key === "Enter" && e.ctrlKey) {
                e.preventDefault();
                submit((e.target as HTMLTextAreaElement).value);
            }
        }
    };

    const onInputChange = (value: string) => {
        const regx = new RegExp("/image\\$\\s*([^\\s]+)");
        setValue(value.replace(regx, "/image"));
    };

    return (
        <footer
            className={classNames(
                isMobile
                    ? ["sticky", "left-0", "bottom-0", "right-0", "p-2", "pr-3", "overflow-hidden"]
                    : ["p-5"]
            )}
        >
            <div className="w-full m-auto">
                <div className="flex items-center justify-between space-x-2">
                    <Button
                        type="text"
                        shape="circle"
                        className="flex items-center justify-center text-lg"
                        onClick={onClear}
                    >
                        <DeleteOutlined />
                    </Button>
                    {!isMobile && (
                        <>
                            <Button
                                type="text"
                                shape="circle"
                                className="flex items-center justify-center text-lg"
                                onClick={onDownload}
                            >
                                <DownloadOutlined />
                            </Button>
                            <Button
                                type="text"
                                shape="circle"
                                className={classNames(
                                    "flex items-center justify-center text-lg hover:text-[#3050fb]",
                                    hasContext && "text-[#3050fb] focus:text-[#3050fb]"
                                )}
                                onClick={onChangeContext}
                            >
                                <ProfileOutlined />
                            </Button>
                        </>
                    )}
                    <Mentions
                        value={value}
                        placeholder={
                            isMobile
                                ? "来说点什么吧...（使用 / 可切换图片模式）"
                                : "来说点什么吧...（Shift + Enter = 换行，使用 / 可切换图片模式）"
                        }
                        prefix={["/"]}
                        placement="top"
                        autoSize={{ minRows: 1, maxRows: 2 }}
                        onChange={onInputChange}
                        onSelect={(e) => setModel(e.value as Model)}
                        onPressEnter={onPressEnter}
                        options={mentionOptions}
                    />
                    <Button type="primary" onClick={() => submit(value)}>
                        <SendOutlined />
                    </Button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

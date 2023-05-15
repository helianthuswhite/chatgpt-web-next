import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { EditOutlined } from "@ant-design/icons";
import classNames from "classnames";
import { Input, Tooltip } from "antd";
import { DEFAULT_TITLE, History } from "@/store/Chat";
import downloadAsImage from "@/utils/downloadAsImage";
import Icon from "@/components/Icon";

interface Props {
    history?: History;
    scrollToTop?: () => void;
}

const Header: React.FC<Props> = ({ history, scrollToTop }) => {
    const [isEdit, setIsEdit] = useState(false);
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (history?.title) {
            setTitle(history.title);
        }
    }, [history?.title]);

    const onDownload = () => {
        const dom = document.querySelector("#image-wrapper") as HTMLElement;
        if (dom) {
            downloadAsImage(dom, (title || DEFAULT_TITLE).substring(0, 10));
        }
    };

    const onEditOk = () => {
        // updateHistory({ uuid, title: value });
        setIsEdit(false);
    };

    return (
        <header
            className={classNames(
                "px-4 py-2 flex items-center justify-between border-0 border-b border-solid border-gray-200",
                "dark:border-neutral-800 dark:bg-black/20"
            )}
        >
            {isEdit ? (
                <Input
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onPressEnter={onEditOk}
                    onBlur={onEditOk}
                />
            ) : (
                <h2
                    onClick={() => setIsEdit(true)}
                    className="text-base text-gray-700 m-0 ml-2 cursor-text group hover:text-gray-400"
                >
                    {title}
                    <EditOutlined className="ml-2 hidden group-hover:inline" />
                </h2>
            )}
            <div className="ml-4 flex items-center">
                <Tooltip title="置顶">
                    <Button
                        type="text"
                        shape="circle"
                        className="flex items-center justify-center text-lg mr-2"
                        onClick={onDownload}
                    >
                        <Icon type="icon-fixtop" />
                    </Button>
                </Tooltip>
                <Tooltip title="分享">
                    <Button
                        type="text"
                        shape="circle"
                        className="flex items-center justify-center text-lg mr-2"
                        onClick={onDownload}
                    >
                        <Icon type="icon-share" />
                    </Button>
                </Tooltip>
            </div>
        </header>
    );
};

export default Header;

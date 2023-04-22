import classNames from "classnames";
import { Image, Spin } from "antd";
import Button from "@/components/Button";

interface Props {
    urls?: string[];
    loading?: boolean;
    onRegenerate?: () => void;
}

const MyImage: React.FC<Props> = ({ loading, urls, onRegenerate }) => {
    const totalImages = urls?.length;
    return (
        <Spin
            wrapperClassName={classNames("w-80", "rounded-md", "p-2", "bg-slate-100")}
            tip="正在努力生成图片中..."
            spinning={loading}
            size="large"
        >
            <div className="flex flex-wrap items-center">
                {totalImages ? (
                    urls.map((url) => (
                        <Image
                            width={totalImages > 1 ? "50%" : "100%"}
                            className="flex-1"
                            alt=""
                            key={url}
                            src={url}
                        />
                    ))
                ) : (
                    <div className="flex-1 flex items-center justify-center flex-col h-60">
                        <p className="mt-4 text-gray-500">图片加载失败(＞﹏＜)</p>
                        <Button type="link" onClick={onRegenerate}>
                            重试
                        </Button>
                    </div>
                )}
            </div>
        </Spin>
    );
};

export default MyImage;

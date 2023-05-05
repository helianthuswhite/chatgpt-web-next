import classNames from "classnames";
import { Image, Spin } from "antd";
import Button from "@/components/Button";
import { useEffect, useState } from "react";

interface Props {
    urls?: string[];
    loading?: boolean;
    onRegenerate?: () => void;
}

const MyImage: React.FC<Props> = ({ loading, urls, onRegenerate }) => {
    const [totalImages, setTotalImages] = useState(0);

    useEffect(() => {
        if (urls) {
            setTotalImages(urls.length);
        }
    }, [urls]);

    return (
        <Spin
            wrapperClassName={classNames("w-80", "rounded-md", "p-2", "bg-slate-100")}
            tip="正在努力生成图片中..."
            spinning={loading}
            size="large"
        >
            <div className="flex flex-wrap items-center min-h-60">
                {totalImages ? (
                    urls?.map((url) => (
                        <Image
                            width={totalImages > 1 ? "50%" : "100%"}
                            className="flex-1"
                            alt=""
                            key={url}
                            src={url}
                            placeholder={
                                <Spin
                                    className="w-full h-full flex items-center justify-center"
                                    spinning
                                    size="large"
                                />
                            }
                            onError={() => setTotalImages(0)}
                        />
                    ))
                ) : (
                    <div className="flex-1 flex items-center justify-center flex-col h-60">
                        {!loading && (
                            <>
                                <p className="mt-4 text-gray-500">图片加载失败(＞﹏＜)</p>
                                <Button type="link" onClick={onRegenerate}>
                                    重试
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>
        </Spin>
    );
};

export default MyImage;

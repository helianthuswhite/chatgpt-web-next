import { message } from "antd";
import domToImage from "dom-to-image";

const downloadAsImage = async (dom: HTMLElement, title: string) => {
    message.loading("处理中...", 1);
    try {
        const scale = window.devicePixelRatio * 2 || 2;
        const { scrollWidth: width, scrollHeight: height } = dom;
        const data = await domToImage.toPng(dom, {
            width: width * scale,
            height: height * scale,
            style: {
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                width: `${width}px`,
                height: `${height}px`,
            },
        });
        const link = document.createElement("a");
        link.download = `${title}.png`;
        link.href = data;
        link.click();
    } catch (error: any) {
        message.error(`下载失败: ${error?.message}`);
    }
};

export default downloadAsImage;

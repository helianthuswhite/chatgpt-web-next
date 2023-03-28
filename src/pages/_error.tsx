import { Result } from "antd";

export default function PageError() {
    return (
        <div className="flex items-center justify-center h-full">
            <Result status="500" title="500" subTitle="服务器好像开小差了~" />
        </div>
    );
}

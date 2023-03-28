import { Result } from "antd";

export default function Page404() {
    return (
        <div className="flex items-center justify-center h-full">
            <Result status="404" title="404" subTitle="抱歉，当前访问的页面不存在" />
        </div>
    );
}

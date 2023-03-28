import dynamic from "next/dynamic";

export default dynamic(() => import("antd").then((mod) => mod.Button), {
    ssr: false,
});

import { Modal, Tabs } from "antd";
import BasicInfo from "@/components/BasicInfo";
import useIsMobile from "@/hooks/useIsMobile";
import Billing from "@/components/Billing";

interface Props {
    open: boolean;
    notice?: string;
    onCancel: () => void;
}

const Setting: React.FC<Props> = ({ open, notice, onCancel }) => {
    const isMobile = useIsMobile();

    return (
        <Modal
            // title="设置"
            open={open}
            onCancel={onCancel}
            maskClosable={false}
            cancelText="取消"
            okText="保存"
            footer={null}
            width={800}
            bodyStyle={isMobile ? {} : { padding: "10px 20px 0 0" }}
        >
            {/* <Tabs destroyInactiveTabPane tabPosition={isMobile ? "top" : "left"}>
                <Tabs.TabPane tab="基本信息" key="1">
                    <BasicInfo notice={notice} />
                </Tabs.TabPane>
                <Tabs.TabPane tab="购买套餐" key="2">
                    <Billing />
                </Tabs.TabPane>
            </Tabs> */}
            <BasicInfo notice={notice} />
        </Modal>
    );
};

export default Setting;

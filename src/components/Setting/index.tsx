import { Col, Input, Modal, Row } from "antd";
import { useContext, useState } from "react";
import { AppStore } from "@/store/App";
import Button from "@/components/Button";
import { UserStore } from "@/store/User";

interface Props {
    open: boolean;
    onCancel: () => void;
}

const Setting: React.FC<Props> = ({ open, onCancel }) => {
    const [editToken, setEditToken] = useState(false);
    const { token, setData } = useContext(AppStore);
    const { userInfo } = useContext(UserStore);

    const onSaveToken = (e: string) => {
        if (!e.trim()) {
            setEditToken(false);
            return;
        }
        setData({ token: e });
        setEditToken(false);
    };

    return (
        <Modal
            title="设置"
            open={open}
            onCancel={onCancel}
            maskClosable={false}
            cancelText="取消"
            okText="保存"
            footer={null}
            width={600}
        >
            {/* <Row align="middle">
                <Col span={6}>
                    <label>请求Token：</label>
                </Col>
                <Col>
                    {editToken ? (
                        <Input
                            defaultValue={token}
                            style={{ minWidth: 300 }}
                            onBlur={(e) => onSaveToken((e.target as HTMLInputElement).value)}
                            onPressEnter={(e) => onSaveToken((e.target as HTMLInputElement).value)}
                        />
                    ) : (
                        <span>{token || "无"}</span>
                    )}
                </Col>
                <Col>
                    {!editToken && (
                        <Button type="link" onClick={() => setEditToken(true)}>
                            修改
                        </Button>
                    )}
                </Col>
            </Row> */}
            <Row align="middle" gutter={[16, 16]}>
                <Col span={6}>
                    <label>邮箱账号：</label>
                </Col>
                <Col span={18}>
                    <span>{userInfo.email}</span>
                </Col>
                <Col span={6}>
                    <label>邀请码：</label>
                </Col>
                <Col span={18}>
                    <span>{userInfo.inviteCode}</span>
                </Col>
                <Col span={6}>
                    <label>剩余对话次数：</label>
                </Col>
                <Col span={18}>
                    <span>{userInfo.integral}</span>
                </Col>
            </Row>
        </Modal>
    );
};

export default Setting;

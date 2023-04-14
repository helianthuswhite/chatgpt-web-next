import { Alert, Col, Input, message, Modal, Popconfirm, Row } from "antd";
import { useCallback, useContext, useEffect, useState } from "react";
import { AppStore } from "@/store/App";
import Button from "@/components/Button";
import { UserStore } from "@/store/User";
import copyToClipboard from "@/utils/copyToClipboard";
import http from "@/service/http";
import { useRouter } from "next/router";
import { ReloadOutlined } from "@ant-design/icons";

interface Props {
    open: boolean;
    notice?: string;
    onCancel: () => void;
}

const Setting: React.FC<Props> = ({ open, onCancel, notice }) => {
    const [editToken, setEditToken] = useState(false);
    const { token, setData } = useContext(AppStore);
    const { userInfo, refreshUserInfo } = useContext(UserStore);
    const router = useRouter();
    const [rechargeOpen, setRechargeOpen] = useState(false);
    const [rechargeCode, setChargeCode] = useState("");
    const [rechargeLoading, setRechargeLoading] = useState(false);

    useEffect(() => {
        if (open) {
            refreshUserInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const onSaveToken = (e: string) => {
        if (!e.trim()) {
            setEditToken(false);
            return;
        }
        setData({ token: e });
        setEditToken(false);
    };

    const onCopyInviteUrl = async () => {
        const url = location.origin + "/login?code=" + userInfo.inviteCode;
        try {
            await copyToClipboard(url);
            message.success("复制成功");
        } catch (error) {
            message.error("复制失败");
        }
    };

    const onLogout = async () => {
        await http.logout();
        router.replace("/login");
    };

    const onReCharge = async () => {
        setRechargeLoading(true);
        try {
            await http.recharget({ key: rechargeCode });
            await refreshUserInfo();
            setRechargeOpen(false);
        } catch (error) {
            console.error(error);
        }
        setRechargeLoading(false);
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
            {notice && <Alert className="mb-4" description={notice} type="error" closable />}
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
                    <Button type="link" onClick={onCopyInviteUrl}>
                        复制邀请链接
                    </Button>
                </Col>
                <Col span={6}>
                    <label>剩余对话次数：</label>
                </Col>
                <Col span={18}>
                    <span>{userInfo.integral}</span>
                    <Popconfirm
                        icon={null}
                        title={
                            <Input
                                value={rechargeCode}
                                placeholder="请输入充值密钥"
                                onChange={(e) => setChargeCode(e.target.value)}
                            />
                        }
                        open={rechargeOpen}
                        cancelText="取消"
                        okText="确认"
                        onConfirm={onReCharge}
                        onCancel={() => setRechargeOpen(false)}
                        okButtonProps={{ loading: rechargeLoading }}
                    >
                        <Button type="link" onClick={() => setRechargeOpen(!rechargeOpen)}>
                            增加次数
                        </Button>
                    </Popconfirm>
                </Col>
                <Col span={24} className="flex justify-center">
                    <Button onClick={onLogout}>退出登录</Button>
                </Col>
            </Row>
        </Modal>
    );
};

export default Setting;

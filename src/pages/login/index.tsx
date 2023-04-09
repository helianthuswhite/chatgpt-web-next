import Button from "@/components/Button";
import useCountDown from "@/hooks/useCountDown";
import http from "@/service/http";
import { Form, Input, message } from "antd";
import classNames from "classnames";
import Image from "next/image";
import { useCallback, useState } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import type { Engine } from "tsparticles-engine";

export interface LoginInfo {
    email: string;
    password: string;
    type?: "email";
}

export interface RegisterInfo extends LoginInfo {
    code: string;
}

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [isRegister, setIsRegister] = useState(false);
    const [codeLoading, setCodeLoading] = useState(false);
    const [countdown, startCount] = useCountDown();
    const [form] = Form.useForm();

    const particlesInit = useCallback(async (engine: Engine) => {
        await loadFull(engine);
    }, []);

    const onFinish = async (info: RegisterInfo) => {
        setLoading(true);
        try {
            await http[isRegister ? "register" : "login"](info);
            message.success(isRegister ? "注册成功" : "登录成功" + "，即将跳转...");
        } catch (error) {
            console.error(error);
        }
        setLoading(false);
    };

    const sendEmail = async () => {
        const email = form.getFieldValue("email");
        if (!email?.trim()) {
            form.validateFields(["email"]);
            return;
        }

        setCodeLoading(true);
        try {
            await http.sendCode({ email });
        } catch (error) {
            console.error(error);
        }
        setCodeLoading(false);

        startCount();
    };

    return (
        <div className="flex h-full items-center justify-center">
            <Particles url="/particles.json" init={particlesInit} />
            <div
                className={classNames(
                    "w-[400px] max-w-md p-10 rounded-md z-10 bg-opacity-30 border-solid border border-gray-200",
                    "backdrop-filter backdrop-blur-sm"
                )}
            >
                {/* <h2 className="text-center text-3xl font-extrabold text-gray-900">登录</h2> */}
                <Image className="m-auto block" width={64} height={64} src="/logo.svg" alt="logo" />
                <Form form={form} className="mt-6" name="basic" onFinish={onFinish}>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: "邮箱地址为空" },
                            { type: "email", message: "邮箱地址格式错误" },
                        ]}
                    >
                        <Input placeholder="请输入邮箱地址" className="rounded text-sm pt-2 pb-2" />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        className={classNames(!isRegister && "mb-2")}
                        rules={[
                            { required: true, message: "密码为空" },
                            { min: 6, message: "密码长度不能小于6位" },
                        ]}
                    >
                        <Input.Password
                            placeholder="请输入密码"
                            className="rounded text-sm pt-2 pb-2"
                        />
                    </Form.Item>

                    {isRegister && (
                        <div className="flex items-center mb-4">
                            <Form.Item
                                name="code"
                                className="mb-0 mr-2 flex-1"
                                rules={[{ required: true, message: "密码为空" }]}
                            >
                                <Input
                                    placeholder="邮箱验证码"
                                    className="rounded text-sm pt-2 pb-2"
                                />
                            </Form.Item>
                            <Button
                                className="h-[38px]"
                                onClick={sendEmail}
                                loading={codeLoading}
                                disabled={!!countdown}
                            >
                                {countdown ? `重发（${countdown}秒）` : "发送验证码"}
                            </Button>
                        </div>
                    )}

                    <Form.Item className="mb-2">
                        <Button
                            className="p-0"
                            type="link"
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {isRegister ? "返回登录" : "注册新账号"}
                        </Button>
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Button
                            size="large"
                            className="w-full rounded"
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                        >
                            {isRegister ? "注册" : "登录"}
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Login;

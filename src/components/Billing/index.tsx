import { Alert } from "antd";
import { useEffect, useState } from "react";
import Button from "@/components/Button";
import http from "@/service/http";
import QRCode from "qrcode";
import classNames from "classnames";
import {
    AlipayCircleOutlined,
    CheckCircleOutlined,
    FireFilled,
    LeftOutlined,
} from "@ant-design/icons";
import Image from "next/image";

export interface ChargeType {
    name: string;
    price: number;
    count: number;
    hot?: boolean;
    type: OrderParams["productType"];
    descs: string[];
}

export interface OrderParams {
    payType: "alipay";
    productType: 1 | 2 | 3;
}

export interface OrderResult {
    orderId: number;
    qrCode: string;
}

export enum OrderStatus {
    toPay = 1,
    payed = 2,
    cancelled = 3,
}

const PayTip = {
    [OrderStatus.toPay]: "检测到您还未扫码，请尽快完成支付",
    [OrderStatus.cancelled]: "检查到您已取消支付，请重新扫码",
};

const BasicInfo: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [statusLoading, setStatusLoading] = useState(false);
    const [qrcode, setQrcode] = useState("");
    const [orderStatus, setOrderStatus] = useState<OrderStatus>(0);
    const [orderInfo, setOrderInfo] = useState<OrderResult | null>(null);
    const charges: ChargeType[] = [
        {
            name: "基础版",
            price: 10,
            type: 1,
            count: 100,
            descs: ["不限时长", "支持使用图片"],
        },
        {
            name: "高级版",
            price: 30,
            type: 2,
            hot: true,
            count: 500,
            descs: ["不限时长", "支持使用图片"],
        },
        {
            name: "尊享版",
            price: 100,
            type: 3,
            count: 2000,
            descs: ["不限时长", "支持使用图片"],
        },
    ];

    const onBuy = async (charge: ChargeType) => {
        setLoading(true);
        setOrderStatus(0);
        try {
            const data = await http.createOrder({ payType: "alipay", productType: charge.type });
            setOrderInfo(data);
        } catch (error: any) {
            console.error(error);
        }
        setLoading(false);
    };

    const genQRCode = async (orderInfo: OrderResult) => {
        const data = await QRCode.toDataURL("https://qr.alipay.com/bax005809ocvevvtoruh25f3");
        setQrcode(data);
    };

    const onCheckPay = async () => {
        setStatusLoading(true);
        try {
            const data = await http.checkOrder(orderInfo!.orderId);
            setOrderStatus(data);
        } catch (error) {
            console.error(error);
        }
        setStatusLoading(false);
    };

    useEffect(() => {
        if (orderInfo) {
            genQRCode(orderInfo);
        }
    }, [orderInfo]);

    if (orderInfo && orderStatus !== OrderStatus.payed) {
        return (
            <div className="min-h-[400px]">
                <Button type="link" onClick={() => setOrderInfo(null)}>
                    <LeftOutlined />
                    重新选择套餐
                </Button>
                <div className="">
                    <div className="flex justify-center align-middle my-4">
                        当前支持扫码方式：
                        <AlipayCircleOutlined className="text-blue-500 text-2xl" />
                    </div>
                    <div className="flex justify-center">
                        {qrcode && (
                            <Image
                                className=" border border-gray-200 border-solid"
                                width="200"
                                height="200"
                                src={qrcode}
                                alt="支付二维码"
                            />
                        )}
                    </div>
                    <div className="text-center mt-2 text-red-500">{PayTip[orderStatus]}</div>
                    <Button
                        loading={statusLoading}
                        onClick={onCheckPay}
                        className="block mt-4 mx-auto"
                    >
                        我已支付
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Alert
                className="bg-transparent"
                banner
                message="当前对话普通文本单次消耗1积分，图片模式单次消耗8积分"
            />
            <div className="my-8 mx-auto flex">
                {charges.map((charge) => (
                    <div
                        key={charge.name}
                        className={classNames(
                            "border border-solid border-gray-200 rounded-md p-5 w-full h-fit",
                            charge.hot && "shadow-xl scale-110 mx-8"
                        )}
                    >
                        <div className="text-xl text-center mb-3">
                            {charge.hot && <FireFilled className="text-red-500 mr-2" />}
                            {charge.name}
                        </div>
                        <div
                            className={classNames(
                                "text-center text-gray-500 border-0 border-b border-solid",
                                "border-gray-200 py-2"
                            )}
                        >
                            <CheckCircleOutlined className="text-green-500 mr-1" />
                            立得<span className="font-bold"> {charge.count} </span>积分
                        </div>
                        {charge.descs.map((desc) => (
                            <div
                                className={classNames(
                                    "text-center text-gray-500 border-0 border-b border-solid",
                                    "border-gray-200 py-2"
                                )}
                                key={desc}
                            >
                                <CheckCircleOutlined className="text-green-500 mr-1" />
                                {desc}
                            </div>
                        ))}
                        <div className="my-4 text-red-500 text-center">
                            ￥<span className="font-bold text-2xl">{charge.price}</span>
                        </div>
                        <Button
                            className="w-full rounded"
                            type="primary"
                            loading={loading}
                            onClick={() => onBuy(charge)}
                        >
                            立即购买
                        </Button>
                    </div>
                ))}
            </div>
        </>
    );
};

export default BasicInfo;

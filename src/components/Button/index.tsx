import dynamic from "next/dynamic";
import { ButtonProps } from "antd";
import { useContext, useRef } from "react";
import { UserStore } from "@/store/User";

export default dynamic(
    () =>
        import("antd").then((mod) => {
            const { Button } = mod;
            const HookButton = ({ onClick, ...props }: ButtonProps) => {
                const buttonRef = useRef<HTMLElement>(null);
                const { userInfo } = useContext(UserStore);

                return (
                    <Button
                        {...props}
                        ref={buttonRef}
                        onClick={(e) => {
                            const name = buttonRef.current?.innerText;
                            const icon = buttonRef.current
                                ?.querySelector(".anticon")
                                ?.getAttribute("aria-label");
                            window.umami.track(name || icon || "未知的按钮", {
                                email: userInfo.email,
                                nickName: userInfo.nickName,
                            });
                            onClick?.(e as any);
                        }}
                    />
                );
            };
            return HookButton;
        }),
    {
        ssr: false,
    }
);

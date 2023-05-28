import { Avatar as AvatarComp, AvatarProps } from "antd";
import { useContext } from "react";
import Image from "next/image";
import { UserStore } from "@/store/User";
import LogoSvg from "@/assets/images/logo.svg";

interface Props extends AvatarProps {
    isUser?: boolean;
}

const Avatar: React.FC<Props> = ({ isUser, ...props }) => {
    const { userInfo } = useContext(UserStore);

    if (isUser) {
        return (
            <AvatarComp {...props} src={userInfo.avatar}>
                {userInfo.name}
            </AvatarComp>
        );
    }

    return (
        <span className="text-[28px] leading-4 text-black dark:text-white">
            <LogoSvg />
        </span>
    );
};

export default Avatar;

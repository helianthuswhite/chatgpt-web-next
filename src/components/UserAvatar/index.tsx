import { useContext } from "react";
import { UserStore } from "@/store/User";
import Avatar from "@/components/Avatar";

interface Props {}

const UserAvatar: React.FC<Props> = () => {
    const { userInfo } = useContext(UserStore);

    return (
        <div className="flex items-center overflow-hidden">
            <div className="w-10 h-10 overflow-hidden rounded-full shrink-0">
                <Avatar isUser size="large" />
            </div>
            <div className="flex-1 min-w-0 ml-2">
                <h2 className="overflow-hidden font-bold text-base m-0 text-ellipsis whitespace-nowrap">
                    {userInfo.name}
                </h2>
                <p className="overflow-hidden text-xs m-0 text-gray-500 text-ellipsis whitespace-nowrap">
                    <span dangerouslySetInnerHTML={{ __html: userInfo.description }} />
                </p>
            </div>
        </div>
    );
};

export default UserAvatar;

import http from "@/service/http";
import { createContext, Dispatch, SetStateAction, useState } from "react";

export interface UserInfo {
    avatar: string;
    name: string;
    email: string;
    description: string;
    integral: number;
    inviteCode: string;
    nickName?: string;
    vipUser?: boolean;
}

export interface userStoreInterface {
    userInfo: UserInfo;
    refreshUserInfo: () => Promise<void>;
    setUserInfo: Dispatch<SetStateAction<UserInfo>>;
}

export const UserStore = createContext<userStoreInterface>({} as userStoreInterface);

const User: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
        avatar: "/author.jpg",
        name: "helianthuswhite",
        email: "",
        integral: 0,
        inviteCode: "",
        description:
            'Star on <a href="https://github.com/helianthuswhite/chatgpt-web-next" class="color-[#3050fb]" target="_blank" >Github</a>',
    });

    const refreshUserInfo = async () => {
        const data = await http.getUserInfo();
        setUserInfo({ ...userInfo, ...data, name: data.nickName || "" });
    };

    return (
        <UserStore.Provider value={{ userInfo, refreshUserInfo, setUserInfo }}>
            {children}
        </UserStore.Provider>
    );
};

export default User;

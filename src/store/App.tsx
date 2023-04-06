import useIsMobile from "@/hooks/useIsMobile";
import storage from "@/service/localStorage";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

export type Theme = "auto" | "dark" | "light";

export interface AppStorage {
    theme?: Theme;
    hasContext?: boolean;
    token?: string;
}

export interface appStoreInterface extends AppStorage {
    setData: (e: AppStorage) => void;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
}

export const LOCAL_APP_NAME = "appStorage";

export const AppStore = createContext<appStoreInterface>({} as appStoreInterface);

const appStorage = storage<AppStorage>();
const defaultValue = appStorage.get(LOCAL_APP_NAME) || {
    theme: "light",
    hasContext: true,
    token: "",
};

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
    const [state, setState] = useState(defaultValue);
    const isMobile = useIsMobile();

    const setData = (e: AppStorage) => {
        setState({ ...state, ...e });
        appStorage.set(LOCAL_APP_NAME, { ...state, ...e });
    };

    useEffect(() => {
        setSidebarCollapsed(isMobile);
    }, [isMobile]);

    return (
        <AppStore.Provider
            value={{
                ...state,
                setData,
                sidebarCollapsed,
                setSidebarCollapsed,
            }}
        >
            {children}
        </AppStore.Provider>
    );
};

export default App;

import useIsMobile from "@/hooks/useIsMobile";
import { createContext, Dispatch, SetStateAction, useEffect, useState } from "react";

export type Theme = "auto" | "dark" | "light";

export interface appStoreInterface {
    theme: Theme;
    setTheme: Dispatch<SetStateAction<Theme>>;
    sidebarCollapsed: boolean;
    setSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
    hasContext: boolean;
    setHasContext: Dispatch<SetStateAction<boolean>>;
}

export const AppStore = createContext<appStoreInterface>({} as appStoreInterface);

const App: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
    const [hasContext, setHasContext] = useState(true);
    const [theme, setTheme] = useState<Theme>("light");
    const isMobile = useIsMobile();

    useEffect(() => {
        setSidebarCollapsed(isMobile);
    }, [isMobile]);

    return (
        <AppStore.Provider
            value={{
                sidebarCollapsed,
                setSidebarCollapsed,
                theme,
                setTheme,
                hasContext,
                setHasContext,
            }}
        >
            {children}
        </AppStore.Provider>
    );
};

export default App;

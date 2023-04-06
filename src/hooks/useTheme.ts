import { AppStore } from "@/store/App";
import { useContext, useEffect, useState } from "react";

const useTheme = () => {
    const { theme } = useContext(AppStore);
    const [type, setType] = useState<"light" | "dark">("light");

    useEffect(() => {
        if (theme === "auto") {
            const type = window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light";
            setType(type);
            return;
        }

        setType(theme as "light" | "dark");
    }, [theme]);

    useEffect(() => {
        if (type === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [type]);

    return type;
};

export default useTheme;

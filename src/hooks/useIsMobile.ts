import { useEffect, useState } from "react";
import debounce from "lodash/debounce";

const useIsMobile = (): boolean => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        if (
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        ) {
            setIsMobile(true);
            return;
        }

        const updateSize = (): void => {
            setIsMobile(window.innerWidth < 768);
        };
        window.addEventListener("resize", debounce(updateSize, 250));
        return (): void => window.removeEventListener("resize", updateSize);
    }, []);

    return isMobile;
};

export default useIsMobile;

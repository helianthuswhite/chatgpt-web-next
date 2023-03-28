import { useRef } from "react";
import Scrollbars from "react-custom-scrollbars";

const useScroll = () => {
    const scrollRef = useRef<Scrollbars>(null);

    const scrollToBottom = async () => {
        if (scrollRef.current) {
            scrollRef.current.scrollToBottom();
        }
    };

    const scrollToTop = async () => {
        if (scrollRef.current) {
            scrollRef.current.scrollToTop();
        }
    };

    return {
        scrollRef,
        scrollToBottom,
        scrollToTop,
    };
};

export default useScroll;

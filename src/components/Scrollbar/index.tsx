import React, { CSSProperties } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import ClientOnly from "@/components/ClientOnly";

interface Props {
    style?: CSSProperties;
    id?: string;
    className?: string;
    autoHide?: boolean;
    direction?: "vertical" | "horizontal" | "both";
    renderView?: React.FunctionComponent<any>;
    renderTrackHorizontal?: React.FunctionComponent<any>;
    renderTrackVertical?: React.FunctionComponent<any>;
}

const Scrollbar = React.forwardRef<Scrollbars, React.PropsWithChildren<Props>>(
    ({ children, direction = "vertical", ...props }, ref) => {
        return (
            <ClientOnly>
                <Scrollbars
                    renderTrackVertical={({ style }) =>
                        direction === "vertical" || direction === "both" ? (
                            <div
                                style={{ ...style, right: 0, top: 2, bottom: 2, borderRadius: 3 }}
                            />
                        ) : (
                            <div style={{ display: "none" }} />
                        )
                    }
                    renderTrackHorizontal={({ style }) =>
                        direction === "horizontal" || direction === "both" ? (
                            <div
                                style={{ ...style, bottom: 0, left: 2, right: 2, borderRadius: 3 }}
                            />
                        ) : (
                            <div style={{ display: "none" }} />
                        )
                    }
                    autoHide
                    {...props}
                    ref={ref}
                >
                    {children}
                </Scrollbars>
            </ClientOnly>
        );
    }
);

Scrollbar.displayName = "Scrollbar";

export default Scrollbar;

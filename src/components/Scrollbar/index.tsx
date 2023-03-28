import React, { CSSProperties } from "react";
import { Scrollbars } from "react-custom-scrollbars";

interface Props {
    style?: CSSProperties;
    id?: string;
    className?: string;
    autoHide?: boolean;
    renderView?: React.FunctionComponent<any>;
    renderTrackHorizontal?: React.FunctionComponent<any>;
    renderTrackVertical?: React.FunctionComponent<any>;
}

const Scrollbar = React.forwardRef<Scrollbars, React.PropsWithChildren<Props>>(
    ({ children, ...props }, ref) => {
        return (
            <Scrollbars
                renderTrackVertical={({ style }) => (
                    <div style={{ ...style, right: 0, top: 2, bottom: 2, borderRadius: 3 }} />
                )}
                renderTrackHorizontal={() => <div style={{ display: "none" }} />}
                autoHide
                {...props}
                ref={ref}
            >
                {children}
            </Scrollbars>
        );
    }
);

Scrollbar.displayName = "Scrollbar";

export default Scrollbar;

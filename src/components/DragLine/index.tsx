import classNames from "classnames";
import React, { useRef, useState } from "react";
import { DraggableCore, DraggableEvent } from "react-draggable";

interface Props {
    leftWidth: number;
    onChangeWidth: (width: number) => void;
    minWidth?: number;
    maxWidth?: number;
    onStart?: () => void;
    onStop?: () => void;
}

const DragLine: React.FC<Props> = ({
    leftWidth,
    minWidth = 0,
    maxWidth = 1000,
    onChangeWidth,
    onStart: onExternalStart,
    onStop: onExternalStop,
}) => {
    const originX = useRef(0);
    const [isDragging, setIsDragging] = useState(false);

    const onStart = (e: DraggableEvent) => {
        originX.current = (e as MouseEvent).clientX;
        onExternalStart?.();
        setIsDragging(true);
    };
    const onDrag = (e: DraggableEvent) => {
        const deltaX = (e as MouseEvent).clientX - originX.current;
        const width = Math.min(Math.max(leftWidth + deltaX, minWidth), maxWidth);
        originX.current = width;
        onChangeWidth(width);
    };

    const onStop = () => {
        setIsDragging(false);
        onExternalStop?.();
    };

    return (
        <DraggableCore onDrag={onDrag} onStart={onStart} onStop={onStop}>
            <div
                className={classNames(
                    "absolute z-10 px-1 top-0 h-full cursor-col-resize",
                    isDragging ? "" : "transition-all"
                )}
                style={{ left: leftWidth - 4 }}
            >
                <div className="w-[1px] h-full bg-gray-200" />
            </div>
        </DraggableCore>
    );
};

export default DragLine;

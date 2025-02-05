/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState } from "react";
import React from 'react';

interface Rectangle {
    width: number;
    height: number;
    x: number;
    y: number;
}
interface ChildComponentProps {
    initialRectangle: Rectangle;
}

const ResizableRectangle: React.FC<ChildComponentProps> = ({ initialRectangle }) => {
    const svgWidth = 500;
    const svgHeight = 500;

    const [rect, setRect] = useState<Rectangle>(initialRectangle);
    const [resized, setResized] = useState(true);
    const [resizing, setResizing] = useState<{ type: string | null; startX: number; startY: number }>({
        type: null,
        startX: 0,
        startY: 0,
    });
    const [dragging, setDragging] = useState(false);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent, type: string) => {
        e.preventDefault();
        setResizing({ type, startX: e.clientX, startY: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (resizing.type) {
            const deltaX = e.clientX - resizing.startX;
            const deltaY = e.clientY - resizing.startY;

            setRect((prev) => {
                let newX = prev.x;
                let newY = prev.y;
                let newWidth = prev.width;
                let newHeight = prev.height;

                switch (resizing.type) {
                    case "bottom-right":
                        newWidth = Math.max(20, prev.width + deltaX);
                        newHeight = Math.max(20, prev.height + deltaY);
                        break;
                    case "bottom-left":
                        newWidth = Math.max(20, prev.width - deltaX);
                        newHeight = Math.max(20, prev.height + deltaY);
                        newWidth > 20 ? newX = prev.x + deltaX : null;
                        break;
                    case "top-left":
                        newWidth = Math.max(20, prev.width - deltaX);
                        newHeight = Math.max(20, prev.height - deltaY);
                        if (newWidth > 20) newX = prev.x + deltaX;
                        if (newHeight > 20) newY = prev.y + deltaY;
                        break;
                    case "top-right":
                        newWidth = Math.max(20, prev.width + deltaX);
                        newHeight = Math.max(20, prev.height - deltaY);
                        newHeight > 20 ? newY = prev.y + deltaY : null;
                        break;
                }
                newWidth === 100 && newHeight === 100 ? setResized(true) : setResized(false);
                return {
                    x: Math.max(0, Math.min(newX, svgWidth - newWidth)),
                    y: Math.max(0, Math.min(newY, svgHeight - newHeight)),
                    width: newWidth,
                    height: newHeight,
                };
            });

            setResizing({ ...resizing, startX: e.clientX, startY: e.clientY });

        }

        if (dragging) {
            const deltaX = e.clientX - dragStartPos.x;
            const deltaY = e.clientY - dragStartPos.y;

            setRect((prev) => {
                const newX = prev.x + deltaX;
                const newY = prev.y + deltaY;

                return {
                    x: Math.max(0, Math.min(newX, svgWidth - prev.width)),
                    y: Math.max(0, Math.min(newY, svgHeight - prev.height)),
                    width: prev.width,
                    height: prev.height,
                };
            });

            setDragStartPos({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setResizing({ type: null, startX: 0, startY: 0 });
        handleValidate();
        setDragging(false);
    };

    const handleMouseDownDrag = (e: React.MouseEvent) => {
        e.preventDefault();
        setDragging(true);
        setDragStartPos({ x: e.clientX, y: e.clientY });
    };
    const handleValidate = async () => {

        const rectData = {
            Width: rect.width,
            Height: rect.height,
            X: rect.x,
            Y: rect.y,
            dragged: dragging
        };

        try {
            const response = await fetch("https://localhost:7070/resize/rectangle-validation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rectData),
            });
            if (response.ok && !dragging) {
                const data = await response.text(); 
                alert(`${data}`);
            }
            else if (!response.ok && !dragging) {
                const errorData = await response.text();  
                alert(`${errorData}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to send request.");
        }
    };


    return (
        <>
            <svg
                width={svgWidth}
                height={svgHeight}
                style={{ border: "1px solid black" }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
            >
                <rect
                    x={rect.x}
                    y={rect.y}
                    width={rect.width}
                    height={rect.height}
                    fill="lightblue"
                    stroke="black"
                    strokeWidth="2"
                    onMouseDown={handleMouseDownDrag}
                />

                {[
                    { cx: rect.x + rect.width, cy: rect.y + rect.height, type: "bottom-right" },
                    { cx: rect.x, cy: rect.y + rect.height, type: "bottom-left" },
                    { cx: rect.x, cy: rect.y, type: "top-left" },
                    { cx: rect.x + rect.width, cy: rect.y, type: "top-right" },
                ].map((handle) => (
                    <circle
                        key={handle.type}
                        cx={handle.cx}
                        cy={handle.cy}
                        r="6"
                        fill="red"
                        onMouseDown={(e) => handleMouseDown(e, handle.type)}
                        style={{ cursor: "nwse-resize" }}
                    />
                ))}
            </svg>
            <p>Width:{rect.width}</p>
            <p>Height: {rect.height}</p>
            <p>Perimeter: {rect.width + rect.height * 2}</p>
            <button type="button" className="btn btn-primary" disabled={resized} onClick={(e) => handleValidate()}>Validate</button>
        </>
    );
};

export default ResizableRectangle;

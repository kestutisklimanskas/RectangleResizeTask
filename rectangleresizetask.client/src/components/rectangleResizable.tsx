/* eslint-disable @typescript-eslint/no-unused-expressions */
import { useState } from "react";
import React from 'react';

interface Rectangle { //added a rectangle for a type
    width: number;
    height: number;
    x: number;
    y: number;
}
//gave the component a parameter to receive from parent component
interface ChildComponentProps {
    initialRectangle: Rectangle;
}

const ResizableRectangle: React.FC<ChildComponentProps> = ({ initialRectangle }) => {
    //svg figure dimensions
    const svgWidth = 500;
    const svgHeight = 500;

    const [rect, setRect] = useState<Rectangle>(initialRectangle);

    //const [resized, setResized] = useState(true); //in case of button use for validation

    const [resizing, setResizing] = useState<{ type: string | null; startX: number; startY: number }>({
        type: null,
        startX: 0,
        startY: 0,
    });

    const [dragging, setDragging] = useState(false);
    const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

    //when one of the resize handlers are clicked
    //checking, which one of the handlers was clicked, MouseEvent determines the coordinates of user's mouse.
    const handleMouseDown = (e: React.MouseEvent, type: string) => {
        e.preventDefault();
        setResizing({ type, startX: e.clientX, startY: e.clientY });
    };

    //method for mouse movements
    //Method constantly updates the rectangle's position and size
    const handleMouseMove = (e: React.MouseEvent) => {

        //if type (a handler was clicked)
        if (resizing.type) {
            const deltaX = e.clientX - resizing.startX;
            const deltaY = e.clientY - resizing.startY;

            setRect((prev) => {
                //position and size calculation based on previous state
                let newX = prev.x;
                let newY = prev.y;
                let newWidth = prev.width;
                let newHeight = prev.height;

               //resizing the figure and handler placement
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
                        newWidth > 20 ? newX = prev.x + deltaX : null;
                        newHeight > 20 ? newY = prev.y + deltaY : null;
                        break;
                    case "top-right":
                        newWidth = Math.max(20, prev.width + deltaX);
                        newHeight = Math.max(20, prev.height - deltaY);
                        newHeight > 20 ? newY = prev.y + deltaY : null;
                        break;
                }
                /* in case for validation a button might be used 
                newWidth === rect.width && newHeight === rect.height ? setResized(true) : setResized(false); */

                //making sure that the rectangle does not go out of SVG bounds with Math.max(0)
                return {
                    x: Math.max(0, Math.min(newX, svgWidth - newWidth)),
                    y: Math.max(0, Math.min(newY, svgHeight - newHeight)),
                    width: newWidth,
                    height: newHeight,
                };
            });

            setResizing({ ...resizing, startX: e.clientX, startY: e.clientY });

        }
        //if rectangle is dragged (handler is not clicked)
        if (dragging) {
            const deltaX = e.clientX - dragStartPos.x;
            const deltaY = e.clientY - dragStartPos.y;

            //only calculating the positioning of the rectangle
            setRect((prev) => {
                const newX = prev.x + deltaX;
                const newY = prev.y + deltaY;

                //ensuring that the rectangle cannot be dragged out of bounds with Math.max
                return {
                    x: Math.max(0, Math.min(newX, svgWidth - prev.width)),
                    y: Math.max(0, Math.min(newY, svgHeight - prev.height)),
                    width: prev.width,
                    height: prev.height,
                };
            });
            //reference to distance of the dragging
            setDragStartPos({ x: e.clientX, y: e.clientY });
        }
    };

    //fired when resize or dragging is done
    const handleMouseUp = () => {
        setResizing({ type: null, startX: 0, startY: 0 });
        handleValidate();
        setDragging(false);
    };
    //fired when figure is being dragged
    const handleMouseDownDrag = (e: React.MouseEvent) => {
        e.preventDefault();
        setDragging(true);
        setDragStartPos({ x: e.clientX, y: e.clientY });
    };
    const handleValidate = async () => {
        //setting rectangle data for fetching, corresponds to Rectangle.cs class/model
        const rectData = {
            Width: rect.width,
            Height: rect.height,
            X: rect.x,
            Y: rect.y,
            dragged: dragging
        };
        try {
            //sending the request
            const response = await fetch("https://localhost:7070/resize/rectangle-validation", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(rectData),
            });
            //logging the precise time when the response was received (for 10 second waiting intervals)
            const currentTime = new Date();
            const timeFormatted = currentTime.toLocaleTimeString('lt-LT', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            //when response is received - fire an alert with a response message
            if (response.ok && !dragging) {
                const data = await response.text(); 

                // logging the size of the rectangle and time when the request was received, to give some clue which resizings were valid/invalid
                console.log(`Valid - Width: ${rect.x}, Height: ${rect.y}, Time: ${timeFormatted}`); 
                alert(`${data}`);
            }
            else if (!response.ok && !dragging) {
                const errorData = await response.text();
                console.log(`Invalid - Width: ${rect.x}, Height: ${rect.y}, Time: ${timeFormatted}`);
                alert(`${errorData}`);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Request failure.");
        }
    };


    return (
        <div className= "mb-2 d-flex justify-content-center flex-column">
            <h1>Rectangle Task</h1>
            <h2>By Kęstutis Klimanskas</h2>
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
                    fill="green"
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
            {/* in case a button is used for validation*/}
            {/* <button type="button" className="btn btn-primary" disabled={resized} onClick={(e) => handleValidate()}>Validate</button>*/}
        </div>
    );
};

export default ResizableRectangle;

import { useEffect, useState } from 'react';
import './App.css';
import ResizableRectangle from './components/rectangleResizable';
import React from 'react';
function App() {
    const [rectangle, setRectangle] = useState(null);

    //using useEffect and calling a method to retrieve JSON data only once on page load with empty dependency
   
    useEffect(() => {
        fetchRectangle();
    }, []);

    //method to retrieve rectangle data
    const fetchRectangle = async () => {
        try {
            const response = await fetch('https://localhost:7070/resize/returnFigure')
                .then((response) => response.json())
                .then((data) => {
                    //if the rectangle has not been declared yet (by default), then sets the received data
                    if (!rectangle) { 
                        setRectangle(data);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                    alert('Error fetching data: ' + error);
                })
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to receive rectangle.");
        }
    };
    //even though the component loads quickly, added some text for a user to see in case of a slower load.
    if (!rectangle) {
        <div>
            <h1>Loading Rectangle...</h1>
        </div>
    }
    //loading the component only when the data is received
    if (rectangle) { 
        return (
            <div>
                <ResizableRectangle initialRectangle={rectangle} />
            </div>
        );
    }
}

export default App;
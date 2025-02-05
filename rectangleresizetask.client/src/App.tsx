import { useEffect, useState } from 'react';
import './App.css';
import ResizableRectangle from './components/rectangleResizable';
import React from 'react';
function App() {
    const [rectangle, setRectangle] = useState(null);
    useEffect(() => {
            fetchRectangle();
    }, []);
    const fetchRectangle = async () => {
        try {
            const response = await fetch('https://localhost:7070/resize/returnFigure')
  .then((response) => response.json()) 
  .then((data) => {
      if (!rectangle) {
          setRectangle(data);
      }
  })
  .catch((error) => {
    console.error('Error fetching data:', error);  // Handle errors
  })
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to receive rectangle.");
        }
    };
    if (rectangle) {
        return (
            <div>
                <ResizableRectangle initialRectangle={rectangle} />
            </div>
        );
    }
}

export default App;
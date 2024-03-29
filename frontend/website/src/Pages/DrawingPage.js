import { useEffect, useRef, useState } from "react";
import { SliderPicker } from 'react-color';
import "./DrawingPage.css";
import axios from 'axios'
import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function DrawingPage() {
  const canvasReference = useRef(null);
  const contextReference = useRef(null);
  const [isPressed, setIsPressed] = useState(false);
  const [currentColor, setCurrentColor] = useState("#000000");
  const [alignment, setAlignment] = React.useState('left');
  const [currentImg, setCurrentImg] = useState("left");
  const [currentAPI, setCurrentAPI] = useState("shirt")

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
    switch (newAlignment) {
      case 'left':
        setCurrentImg("left");
        setCurrentAPI("shirt")
        break;
      case 'middle':
        setCurrentImg("middle");
        setCurrentAPI("pants")
        break;
      case 'right':
        setCurrentImg("right");
        // console.log(currentImg);
        break;
      default:
        setCurrentImg('./white-tshirt');
        break;
    }
  };

  const clearCanvas = () => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const beginDraw = (x, y) => {
    contextReference.current.beginPath();
    contextReference.current.moveTo(x, y);
    setIsPressed(true);
  };

  const updateDraw = (x, y) => {
    if (!isPressed) return;
    const context = contextReference.current;
    context.lineTo(x, y);
    context.stroke();
  };

  const endDraw = () => {
    contextReference.current.closePath();
    setIsPressed(false);
  };

  const handleMouseDown = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    beginDraw(offsetX, offsetY);
  };

  const handleMouseMove = (e) => {
    const { offsetX, offsetY } = e.nativeEvent;
    updateDraw(offsetX, offsetY);
  };

  const handleMouseUp = endDraw;

  const handleTouchStart = (e) => {
    e.preventDefault();
    const { clientX, clientY } = e.touches[0];
    const { left, top } = canvasReference.current.getBoundingClientRect();
    beginDraw(clientX - left, clientY - top);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const { clientX, clientY } = e.touches[0];
    const { left, top } = canvasReference.current.getBoundingClientRect();
    updateDraw(clientX - left, clientY - top);
  };

  const handleTouchEnd = endDraw;

  useEffect(() => {
    const canvas = canvasReference.current;
    const context = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 600;
    context.lineCap = "round";
    context.lineWidth = 5;
    contextReference.current = context;
  }, []);

  useEffect(() => {
    const context = contextReference.current;
    context.strokeStyle = currentColor;
  }, [currentColor]);

  const handleColorChange = (color) => setCurrentColor(color.hex);

  const saveDrawing = () =>{
    if(currentAPI === "shirt"){
        saveShirt();
    }
    else{
        savePants();
    }
  }
  const saveShirt = () => {
    const canvas = canvasReference.current;
    const imgData = canvas.toDataURL("image/png");
  
    // Remove the data URI header
    const base64Data = imgData.replace(/^data:image\/png;base64,/, "");

    // Assuming your endpoint is "https://example.com/upload"
    const endpoint = 'http://localhost:4000/db/shirts/create';
  
    axios.post(endpoint, { title:"shirt" , season: "fall",image: base64Data }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(response => {
        console.log('Image uploaded successfully:', response.data);
      })
      .catch(error => {
        console.error('Error uploading image:', error.message);
      });
    // const link = document.createElement("a");
    // link.href = imgData;
    // link.download = alignment === "left" ? "shirt_drawing.png" : "pants_drawing.png";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
  };
  const savePants = () =>{
    const canvas = canvasReference.current;
    const imgData = canvas.toDataURL("image/png");
  
    // Remove the data URI header
    const base64Data = imgData.replace(/^data:image\/png;base64,/, "");

    // Assuming your endpoint is "https://example.com/upload"
    const endpoint = 'http://localhost:4000/db/pants/create';
  
    axios.post(endpoint, { title:"pants" , season: "fall", image: base64Data }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })
      .then(response => {
        console.log('Image uploaded successfully:', response.data);
      })
      .catch(error => {
        console.error('Error uploading image:', error.message);
      });

  }



  return (
    <div className="container">
     <ToggleButtonGroup
      value={alignment}
      exclusive
      onChange={handleAlignment}
      aria-label="text alignment"
      className="toggles"
    >
      <ToggleButton sx={{
        '&.MuiToggleButton-root': {
          background: "white",
          color: "black"
        },
        '&.MuiToggleButton-root:hover': {
          background: "white",
          opacity: 0.5,
          transition: "0.3s ease-in "

        },
        '&.Mui-selected': {
          color: 'grey', // Color when selected
          background: "rgba(10, 10, 1, 0.5)", 
          transition: "0.3s ease-in "
        },
      }}  
      value="left" aria-label="left"> Shirt </ToggleButton>
     <ToggleButton sx={{
         '&.MuiToggleButton-root': {
          background: "white",
          color: "black"
        },
        '&.MuiToggleButton-root:hover': {
          background: "white",
          opacity: 0.5,
          transition: "0.3s ease-in "

        },
        '&.Mui-selected': {
          color: 'grey', // Color when selected
          background: "rgba(10, 10, 1, 0.5)", 
          transition: "0.3s ease-in "
        },
      }}  
      value="middle" aria-label="middle"> Pant Leg </ToggleButton>
      {/* <ToggleButton sx={{
         '&.MuiToggleButton-root': {
          background: "white",
          color: "black"
        },
        '&.MuiToggleButton-root:hover': {
          background: "white",
          opacity: 0.5,
          transition: "0.3s ease-in "

        },
        '&.Mui-selected': {
          color: 'grey', // Color when selected
          background: "rgba(10, 10, 1, 0.5)", 
          transition: "0.3s ease-in "
        },
      }}  
      value="right" aria-label="right"> Pants Right </ToggleButton> */}
    </ToggleButtonGroup>

      <canvas
        ref={canvasReference}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        id={currentImg}
      > 
      </canvas>
      <div className="color-picker">
        <SliderPicker color={currentColor} onChange={handleColorChange} />
      </div>
      <div className="buttons">
        <button onClick={clearCanvas}>Clear</button>
        <button onClick={saveDrawing}>Save</button>
      </div>
    </div>
  );
}

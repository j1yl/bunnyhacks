"use client";

import React, { useEffect, useState, useRef } from "react";

const Grid = () => {
  const [asciiArt, setAsciiArt] = useState<string[]>([]);
  const [frameCount, setFrameCount] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const asciiChars = "%@#!*+=-:.";
  const scrambleRate = 10;

  useEffect(() => {
    const updateDimensions = () => {
      if (gridRef.current) {
        const dimensions = {
          width: gridRef.current.offsetWidth,
          height: gridRef.current.offsetHeight,
        };
        generateAsciiArt("BUNNYHACKS", dimensions.width, dimensions.height);
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    const interval = setInterval(() => {
      setFrameCount((prevCount) => prevCount + 1);
    }, 100);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (frameCount % scrambleRate === 0) {
      setAsciiArt((currentAscii) =>
        currentAscii.map((row) =>
          row
            .split("")
            .map((char) =>
              char !== "." && Math.random() > 0.9
                ? asciiChars[Math.floor(Math.random() * asciiChars.length)]
                : char
            )
            .join("")
        )
      );
    }
  }, [frameCount]);

  const generateAsciiArt = (
    text: string,
    canvasWidth: number,
    canvasHeight: number
  ) => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    if (!context) return;

    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    const fontSize = (canvasWidth / text.length) * 0.6;
    context.font = `900 ${fontSize}px sans-serif`;
    context.fillStyle = "white";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(text, canvasWidth / 2, canvasHeight / 2);

    const imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
    const pixels = imageData.data;
    const asciiImage = [];

    const stepY = Math.ceil(fontSize / 16);
    const stepX = Math.ceil((stepY * 9) / 16);

    for (let y = 0; y < canvasHeight; y += stepY) {
      let row = "";
      for (let x = 0; x < canvasWidth; x += stepX) {
        const offset = (y * canvasWidth + x) * 4;
        const alpha = pixels[offset + 3];
        if (alpha === 0) {
          row += ".";
        } else {
          const color =
            (pixels[offset] + pixels[offset + 1] + pixels[offset + 2]) / 3;
          const brightness = color / 255;
          const charIndex = Math.floor(
            (1.0 - brightness) * (asciiChars.length - 1)
          );
          row += asciiChars[charIndex];
        }
      }
      asciiImage.push(row);
    }

    setAsciiArt(asciiImage);
  };

  return (
    <div
      ref={gridRef}
      className="w-full h-screen overflow-hidden flex flex-col items-center justify-center leading-none"
    >
      {asciiArt.map((row, i) => (
        <pre key={i}>{row}</pre>
      ))}
    </div>
  );
};

export default Grid;

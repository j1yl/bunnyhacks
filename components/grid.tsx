"use client";

import React, { useEffect, useState, useRef } from "react";

type Props = {};

const Grid: React.FC<Props> = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (gridRef.current) {
        setDimensions({
          width: gridRef.current.offsetWidth,
          height: gridRef.current.offsetHeight,
        });
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const init = (): string[][] => {
    const charWidth = 7;
    const charHeight = 16;
    const rows = Math.floor(dimensions.height / charHeight);
    const cols = Math.floor(dimensions.width / charWidth);

    const grid = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => ".")
    );

    // Determine the size of the "B"
    const bHeight = rows; // The "B" takes up the full height
    const bWidth = Math.max(5, Math.floor(cols / 5)); // Ensure the "B" has a minimum width, adjust as needed

    // Fill the grid to draw a large "B"
    for (let row = 0; row < bHeight; row++) {
      for (let col = 0; col < bWidth; col++) {
        // Simple logic to create a "B" shape, needs customization
        if (
          col === 0 || // Vertical line
          ((row === 0 ||
            row === bHeight - 1 ||
            row === Math.floor(bHeight / 2)) &&
            col < bWidth - 1) || // Top, middle, bottom horizontal lines
          (col === bWidth - 1 &&
            row !== 0 &&
            row !== bHeight - 1 &&
            row !== Math.floor(bHeight / 2))
        ) {
          // Right side curves, simplified
          grid[row][col] = "%";
        }
      }
    }

    return grid;
  };

  const grid = init();

  return (
    <div
      ref={gridRef}
      className="w-full min-h-screen overflow-hidden grid grid-cols-1 whitespace-pre leading-[16px]"
    >
      {grid.map((row, i) => (
        <span key={i}>{row.join("")}</span>
      ))}
    </div>
  );
};

export default Grid;

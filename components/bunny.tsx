"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import NextImage from "next/image";

type Props = {};

export default function Bunny({}: Props) {
  const [ascii, setAscii] = useState<string>("loading");
  const [scrambledAscii, setScrambledAscii] = useState<string>("");
  const [open, IsOpen] = useState<boolean>(false);

  useEffect(() => {
    convert("/bunny.png").then((asciiArt) => {
      setAscii(asciiArt as string);
      scrambleAscii(asciiArt as string);
    });
  }, []);

  async function convert(imageUrl: string) {
    const image = new Image();
    image.src = imageUrl;
    await image.decode();

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = 64;
    canvas.height = 32;
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let ascii = "";
    for (let i = 0; i < imageData.data.length; i += 4) {
      const grayscale =
        (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
      ascii += mapGrayscaleToAscii(grayscale);
      if ((i / 4 + 1) % canvas.width === 0) {
        ascii += "\n";
      }
    }

    ascii = ascii
      .split("\n")
      .filter((line) => line.trim() !== "")
      .join("\n");

    return ascii;
  }

  const scrambleAscii = (asciiArt: string) => {
    let scrambled = asciiArt.replace(/[^\s]/g, () => randomAsciiChar());
    setScrambledAscii(scrambled);
    animateAscii(asciiArt, scrambled, 0);
  };

  const animateAscii = (
    targetAscii: string,
    currentAscii: string,
    index: number
  ) => {
    // How many characters we want to try to reveal per frame.
    const charsPerFrame = 5;

    // Stop condition.
    if (index >= targetAscii.length) {
      setScrambledAscii(targetAscii); // Ensure the final frame is the complete ASCII art.
      return;
    }

    let nextAscii = currentAscii.split("");

    // Attempt to update several characters per frame.
    for (let i = 0; i < charsPerFrame; i++) {
      const updateIndex = index + i;
      // Ensure we don't go out of bounds.
      if (updateIndex < targetAscii.length) {
        if (targetAscii[updateIndex] !== "\n") {
          nextAscii[updateIndex] = targetAscii[updateIndex];
        }
      }
    }

    setScrambledAscii(nextAscii.join(""));

    // Increment by charsPerFrame to speed up the animation.
    setTimeout(
      () =>
        animateAscii(targetAscii, nextAscii.join(""), index + charsPerFrame),
      5
    );
  };

  const randomAsciiChar = () => {
    const characters = "#+~<>i!lI;:,\"^`'.";
    return characters[Math.floor(Math.random() * characters.length)];
  };

  function mapGrayscaleToAscii(grayscale: number) {
    const characters = "#+~<>i!lI;: ";
    return characters[
      Math.floor(mapRange(grayscale, 0, 255, characters.length - 1, 0))
    ];
  }

  function mapRange(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number
  ) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

  return (
    <div className="mx-auto my-auto min-h-screen relative flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute top-0 right-0 m-4 px-2 py-1 bg-black text-white"
      >
        bunnyhacks 2024
        <br />
        <br />
        <motion.button
          onClick={() => IsOpen(!open)}
          className="hover:no-underline underline"
        >
          {open ? "see ascii" : "see bunny"}
        </motion.button>
      </motion.div>
      <div className=" selection:text-white selection:bg-black">
        {open ? (
          <NextImage src="/bunny.png" alt="bunny" width="64" height="32" />
        ) : (
          <motion.pre
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              overflowWrap: "break-word",
            }}
          >
            {scrambledAscii}
          </motion.pre>
        )}
      </div>
    </div>
  );
}

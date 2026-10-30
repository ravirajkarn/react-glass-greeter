import { useState, useEffect } from "react";
import "./theme.css";
import { FastAverageColor } from "fast-average-color";

// @ts-ignore
// Perceived Luminescence
function _perceivedLuminescence(imageSrc: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    canvas.style.display = "none";
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return reject(new Error("Canvas 2D context not available"));
    }

    canvas.width = 50;
    canvas.height = 50;

    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 50, 50);

      const imageData = ctx?.getImageData(0, 0, 50, 50);
      const { data } = imageData;

      let totalLuminosity = 0;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        const luminosity = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        totalLuminosity += luminosity;
      }

      const pixelCount = data.length / 4;
      const averageLuminosity = totalLuminosity / pixelCount;
      // console.log(averageLuminosity);

      const result = averageLuminosity > 128 ? "light" : "dark";
      // console.log(result);

      resolve(result);
    };

    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = imageSrc;
  });
}
const fac = new FastAverageColor();

async function getThemeForImage(imageSrc: string): Promise<"light" | "dark"> {
  try {
    const color = await fac.getColorAsync(imageSrc);
    return color.isDark ? "dark" : "light";
  } catch (error) {
    console.error("Failed to fetch average color:", error);
    return "light";
  }
}

export default function useDynamicTheme(backgroundImageUrl: string) {
  const [theme, setTheme] = useState<string>(() => {
    return localStorage.getItem("theme") || "";
  });

  // useEffect(() => {
  //   if (!backgroundImageUrl) return;

  //   document.body.style.backgroundImage = `url(${backgroundImageUrl})`;
  //   document.body.classList.add(
  //     "bg-cover",
  //     "bg-no-repeat",
  //     "bg-center",
  //     "bg-fixed",
  //     "min-h-screen",
  //     "overflow-hidden",
  //   );

  //   return () => {
  //     document.body.style.backgroundImage = "";
  //     document.body.classList.remove(
  //       "bg-cover",
  //       "bg-no-repeat",
  //       "bg-center",
  //       "bg-fixed",
  //       "min-h-screen",
  //       "overflow-hidden",
  //     );
  //   };
  // }, [backgroundImageUrl]);

  useEffect(() => {
    if (backgroundImageUrl) {
      void getThemeForImage(backgroundImageUrl).then(setTheme);
    }
  }, [backgroundImageUrl]);

  useEffect(() => {
    if (theme) {
      // _perceivedLuminescence(DefaultBG.toString())
      //   .then(setTheme)
      //   .catch((error) => {
      //     console.log(error);
      //   });

      document.documentElement.dataset.theme = theme;
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return theme;
}

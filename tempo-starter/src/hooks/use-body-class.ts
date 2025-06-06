"use client";

import { useEffect } from "react";

export function useBodyClass(className: string) {
  useEffect(() => {
    // Ensure the body has the correct className on the client
    const body = document.body;
    const existingClasses = body.className.split(" ").filter(Boolean);
    const newClasses = className.split(" ").filter(Boolean);

    // Remove any classes that shouldn't be there and add the font class
    const finalClasses = new Set();

    // Add the intended classes
    newClasses.forEach((cls) => finalClasses.add(cls));

    // Keep any dynamically added classes that don't conflict
    existingClasses.forEach((cls) => {
      // Keep classes that start with known prefixes (like vsc-initialized from VS Code)
      // but ensure they don't conflict with our intended styling
      if (
        cls.startsWith("vsc-") ||
        cls.startsWith("theme-") ||
        cls.startsWith("dark") ||
        cls.startsWith("light")
      ) {
        finalClasses.add(cls);
      }
    });

    body.className = Array.from(finalClasses).join(" ");
  }, [className]);
}

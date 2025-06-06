"use client";

import { useBodyClass } from "@/hooks/use-body-class";

interface BodyClassManagerProps {
  className: string;
}

export function BodyClassManager({ className }: BodyClassManagerProps) {
  useBodyClass(className);
  return null; // This component doesn't render anything visible
}

"use client";

import { Button, ButtonProps } from "@chakra-ui/react";
import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type Props = ButtonProps & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = "Submitting...",
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} {...props}>
      {pending ? pendingText : children}
    </Button>
  );
}

import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "flex h-12 w-full border border-[#E5DFD5] bg-[#FFFDF9] px-4 py-2.5 text-sm text-[#161616] placeholder:text-[#6B655E]/65 transition-colors focus:border-[#A68352] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[#9B2C2C]",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[96px] w-full border border-[#E5DFD5] bg-[#FFFDF9] px-4 py-3 text-sm text-[#161616] placeholder:text-[#6B655E]/65 transition-colors focus:border-[#A68352] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[#9B2C2C]",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

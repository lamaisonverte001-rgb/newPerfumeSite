import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-12 w-full border border-[#E5DFD5] bg-[#FAF8F5] px-4 py-2 text-sm text-[#161616] placeholder:text-[#6B655E]/70 transition-colors focus-visible:outline-none focus-visible:border-[#A68352] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full border border-[#E5DFD5] bg-[#FAF8F5] px-4 py-3 text-sm text-[#161616] placeholder:text-[#6B655E]/70 transition-colors focus-visible:outline-none focus-visible:border-[#A68352] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Input, Textarea };

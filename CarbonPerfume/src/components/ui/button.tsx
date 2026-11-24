import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-medium uppercase tracking-[0.18em] transition-all duration-300 disabled:pointer-events-none disabled:opacity-45 cursor-pointer select-none",
  {
    variants: {
      variant: {
        primary:
          "bg-[#161616] text-[#FAF8F5] hover:bg-[#2C2A27] active:scale-[0.99]",
        bronze:
          "bg-[#A68352] text-[#FAF8F5] hover:bg-[#8E6E42] active:scale-[0.99]",
        outline:
          "border border-[#161616]/25 bg-transparent text-[#161616] hover:border-[#161616] hover:bg-[#161616] hover:text-[#FAF8F5]",
        subtle:
          "border border-[#E5DFD5] bg-[#F2EDE6] text-[#161616] hover:border-[#A68352] hover:bg-[#EAE2D6]",
        ghost:
          "bg-transparent text-[#161616] hover:bg-[#F2EDE6]",
      },
      size: {
        default: "h-12 px-7 py-3",
        sm: "h-9 px-4 py-2 text-[11px] tracking-[0.15em]",
        lg: "h-14 px-9 py-4 text-xs tracking-[0.2em]",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };

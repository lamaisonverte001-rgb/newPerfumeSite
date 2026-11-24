import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-xs font-medium uppercase tracking-[0.18em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#A68352] disabled:pointer-events-none disabled:opacity-45 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[#161616] text-[#FAF8F5] hover:bg-[#2C2A27] border border-[#161616]",
        bronze:
          "bg-[#A68352] text-[#FAF8F5] hover:bg-[#8E6E41] border border-[#A68352]",
        outline:
          "border border-[#161616] bg-transparent text-[#161616] hover:bg-[#161616] hover:text-[#FAF8F5]",
        subtle:
          "border border-[#E5DFD5] bg-[#F2EDE6] text-[#161616] hover:border-[#A68352] hover:bg-[#EAE3D9]",
        ghost:
          "bg-transparent text-[#161616] hover:bg-[#F2EDE6] hover:text-[#161616]",
        link: "text-[#161616] underline-offset-4 hover:underline tracking-[0.14em]",
      },
      size: {
        default: "h-12 px-7",
        sm: "h-9 px-4 text-[11px]",
        lg: "h-14 px-9 text-xs",
        icon: "h-10 w-10 tracking-normal",
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

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

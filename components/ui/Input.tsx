import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-13px font-medium text-text-secondary pl-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn("input-base w-full", className)}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

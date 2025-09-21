"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, value, onValueChange, ...props }, ref) => {
    return (
      <div className="relative">
        <select
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-md border border-gray-600 bg-gray-800 px-3 py-2 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50 appearance-none",
            className
          )}
          ref={ref}
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
      </div>
    );
  }
);
Select.displayName = "Select";

const SelectTrigger = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <Select ref={ref} className={className} {...props}>
      {children}
    </Select>
  )
);
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder }: { placeholder?: string }) => (
  <span className="text-gray-300">{placeholder}</span>
);

const SelectContent = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-gray-800 border border-gray-600 rounded-md", className)}>
    {children}
  </div>
);

const SelectItem = React.forwardRef<
  HTMLOptionElement,
  React.OptionHTMLAttributes<HTMLOptionElement> & {
    value: string;
  }
>(({ className, children, ...props }, ref) => (
  <option
    ref={ref}
    className={cn(
      "bg-gray-800 text-white hover:bg-gray-700 focus:bg-gray-700",
      className
    )}
    {...props}
  >
    {children}
  </option>
));
SelectItem.displayName = "SelectItem";

export {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
};

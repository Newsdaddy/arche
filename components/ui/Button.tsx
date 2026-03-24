"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  children,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90 focus:ring-accent disabled:bg-accent/50",
    secondary: "bg-secondary text-primary hover:bg-secondary/80 focus:ring-secondary",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-primary hover:bg-secondary focus:ring-secondary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-small",
    md: "px-4 py-2 text-body",
    lg: "px-6 py-3 text-body font-bold",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

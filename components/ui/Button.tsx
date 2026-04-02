"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "link";
  size?: "sm" | "md" | "lg" | "xl";
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
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const variants = {
    primary: "bg-accent text-white hover:bg-accent-600 focus-visible:ring-accent shadow-lg shadow-accent/25 hover:shadow-accent/40 disabled:bg-accent/50 disabled:shadow-none",
    secondary: "bg-primary text-white hover:bg-primary-800 focus-visible:ring-primary",
    outline: "border-2 border-primary-200 text-primary hover:bg-primary-50 hover:border-primary-300 focus-visible:ring-primary",
    ghost: "text-primary hover:bg-primary-50 focus-visible:ring-primary-200",
    link: "text-accent hover:text-accent-600 underline-offset-4 hover:underline focus-visible:ring-accent",
  };

  const sizes = {
    sm: "px-4 py-2 text-small",
    md: "px-5 py-2.5 text-body",
    lg: "px-6 py-3 text-body font-bold",
    xl: "px-8 py-4 text-body-lg font-bold",
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

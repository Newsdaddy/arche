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
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-none transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-dark";

  const variants = {
    primary: "bg-[#0891B2] text-white hover:bg-[#0E7490] focus-visible:ring-[#0891B2] shadow-lg shadow-[#0891B2]/20 hover:shadow-[#0891B2]/30 disabled:bg-[#0891B2]/50 disabled:shadow-none",
    secondary: "bg-dark-lighter text-white hover:bg-dark-100 focus-visible:ring-white/50 border border-white/10",
    outline: "border-2 border-white/20 text-white hover:bg-white/5 hover:border-white/40 focus-visible:ring-white/50",
    ghost: "text-white hover:bg-white/10 focus-visible:ring-white/30",
    link: "text-white hover:text-primary-300 underline-offset-4 hover:underline focus-visible:ring-white/30",
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

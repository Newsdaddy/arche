"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "elevated" | "feature" | "muted";
  hoverable?: boolean;
}

const cardVariants = {
  default: "bg-dark-lighter border border-white/10 shadow-sm",
  elevated: "bg-dark-lighter shadow-soft border border-white/10",
  feature: "bg-dark-lighter border border-white/10 hover:border-white/30 hover:shadow-glow",
  muted: "bg-dark-100 border border-white/5",
};

export default function Card({
  children,
  className = "",
  onClick,
  variant = "default",
  hoverable = false
}: CardProps) {
  const hoverStyles = hoverable || variant === "feature"
    ? "cursor-pointer transition-all duration-300 hover:-translate-y-1"
    : "";

  return (
    <div
      className={`rounded-2xl p-6 ${cardVariants[variant]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return <h3 className={`text-h3 text-white ${className}`}>{children}</h3>;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return <p className={`text-body text-primary-400 mt-2 ${className}`}>{children}</p>;
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className = "" }: CardFooterProps) {
  return <div className={`mt-4 pt-4 border-t border-white/10 ${className}`}>{children}</div>;
}

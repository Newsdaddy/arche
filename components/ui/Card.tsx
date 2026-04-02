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
  default: "bg-white border border-primary-100 shadow-sm",
  elevated: "bg-white shadow-soft",
  feature: "bg-white border border-primary-100 hover:border-accent/30 hover:shadow-lg",
  muted: "bg-primary-50 border border-primary-100",
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
  return <h3 className={`text-h3 text-primary ${className}`}>{children}</h3>;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return <p className={`text-body text-primary-500 mt-2 ${className}`}>{children}</p>;
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
  return <div className={`mt-4 pt-4 border-t border-primary-100 ${className}`}>{children}</div>;
}

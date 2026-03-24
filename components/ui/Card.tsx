"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function Card({ children, className = "", onClick, hoverable = false }: CardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm p-6 ${hoverable ? "hover:shadow-md hover:border-accent/20 cursor-pointer transition-all duration-200" : ""} ${className}`}
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
  return <h3 className={`text-h2 text-primary ${className}`}>{children}</h3>;
}

interface CardDescriptionProps {
  children: ReactNode;
  className?: string;
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return <p className={`text-body text-gray-600 mt-1 ${className}`}>{children}</p>;
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
  return <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>{children}</div>;
}

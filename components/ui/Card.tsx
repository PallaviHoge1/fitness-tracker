import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`rounded-2xl bg-white/[0.025] border border-white/[0.06] backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

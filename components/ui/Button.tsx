import React from "react";
import { LucideIcon } from "lucide-react";

const VARIANTS = {
  primary: "bg-emerald-400 text-emerald-950 hover:bg-emerald-300 active:bg-emerald-500",
  secondary: "bg-white/[0.06] text-white hover:bg-white/[0.1] active:bg-white/[0.04] border border-white/[0.06]",
  ghost: "bg-transparent text-white/70 hover:bg-white/[0.04] hover:text-white",
  danger: "bg-red-500/10 text-red-300 hover:bg-red-500/20 active:bg-red-500/5 border border-red-500/20",
} as const;

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: keyof typeof VARIANTS;
  disabled?: boolean;
  className?: string;
  icon?: LucideIcon;
  type?: "button" | "submit";
}

export function Button({
  children,
  onClick,
  variant = "primary",
  disabled,
  className = "",
  icon: Icon,
  type = "button",
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed select-none ${VARIANTS[variant]} ${className}`}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
}

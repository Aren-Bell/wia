import type { ButtonHTMLAttributes } from "react";

export function Button({
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
}) {
  return (
    <button
      type={type}
      className={`button button--${variant} ${className}`}
      {...props}
    />
  );
}

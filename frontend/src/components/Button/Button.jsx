import { Loader2 } from "lucide-react";
import "./Button.css";

/**
 * variant: "primary" | "secondary" | "ghost" | "danger"
 * size: "sm" | "md" | "lg"
 */
export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  icon: Icon,
  type = "button",
  className = "",
  ...rest
}) {
  return (
    <button
      type={type}
      className={`btn btn-${variant} btn-${size} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <Loader2 size={16} className="btn-spinner" aria-hidden="true" />
      ) : (
        Icon && <Icon size={16} aria-hidden="true" />
      )}
      <span>{children}</span>
    </button>
  );
}

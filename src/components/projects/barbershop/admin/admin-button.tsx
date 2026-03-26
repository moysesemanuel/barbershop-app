import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "@/app/admin/admin.module.css";

type AdminButtonVariant = "primary" | "secondary" | "warning" | "success" | "danger";

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: AdminButtonVariant;
};

const variantClassMap: Record<AdminButtonVariant, string> = {
  primary: styles.buttonPrimary,
  secondary: styles.buttonSecondary,
  warning: styles.buttonWarning,
  success: styles.buttonSuccess,
  danger: styles.buttonDanger,
};

export function AdminButton({
  children,
  className,
  variant = "primary",
  ...props
}: AdminButtonProps) {
  const classes = [
    variantClassMap[variant],
    className ?? null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

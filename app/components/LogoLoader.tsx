/**
 * Brand loading indicator: logo mark with a spinning ring (matches Navbar mark).
 */
export default function LogoLoader({
  size = "md",
  variant = "default",
  className = "",
  "aria-label": ariaLabel = "Loading",
}: {
  size?: "xxs" | "xs" | "compact" | "sm" | "md" | "lg";
  variant?: "default" | "onPrimary" | "onDark";
  className?: string;
  "aria-label"?: string;
}) {
  const ring =
    variant === "onPrimary"
      ? "border-primary-300/45 border-t-primary-100"
      : variant === "onDark"
        ? "border-white/35 border-t-white"
        : "border-primary-200 border-t-primary-600";
  const logoClass =
    variant === "onPrimary"
      ? "text-primary-100"
      : variant === "onDark"
        ? "text-white"
        : "text-primary-800";

  const outer = {
    xxs: "h-3 w-3",
    xs: "h-4 w-4",
    compact: "h-6 w-6",
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  } as const;
  const logo = {
    xxs: "h-1.5 w-1.5",
    xs: "h-2.5 w-2.5",
    compact: "h-4 w-4",
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  } as const;
  const borderWidth =
    size === "xxs" || size === "xs"
      ? "border"
      : size === "compact" || size === "sm"
        ? "border-2"
        : "border-[3px]";

  return (
    <div
      className={`relative inline-flex shrink-0 items-center justify-center ${outer[size as keyof typeof outer]} ${className}`}
      role="status"
      aria-label={ariaLabel}
    >
      <div
        className={`absolute inset-0 rounded-full ${borderWidth} ${ring} animate-spin`}
        aria-hidden
      />
      <svg
        className={`relative z-10 ${logo[size as keyof typeof logo]} ${logoClass}`}
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden
        focusable={false}
      >
        <title>{ariaLabel}</title>
        <path d="M1 21h12v2H1zM5.245 8.07l2.83-2.827 14.14 14.142-2.828 2.828zM12.317 1l5.657 5.656-2.828 2.83-5.657-5.66zM3.825 9.485l5.657 5.657-2.828 2.828-5.657-5.657z" />
      </svg>
    </div>
  );
}

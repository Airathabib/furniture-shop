import { cn } from "@/lib/utils";

type H4Props = React.ComponentProps<"h4"> & {
  size?: "small" | "medium" | "large" | "xlarge" | "custom";
};

const sizeVariants = {
  small: "text-base sm:text-lg",
  medium: "text-xl sm:text-2xl",
  large: "text-2xl sm:text-3xl lg:text-4xl",
  xlarge: "text-3xl sm:text-4xl lg:text-5xl xl:text-6xl",
  custom: "",
};

export function TypographyH4({
  className,
  children,
  size = "medium",
  ...props
}: H4Props) {
  return (
    <h3
      className={cn(
        "scroll-m-20 text-center font-semibold tracking-tight text-balance",
        sizeVariants[size],
        className,
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

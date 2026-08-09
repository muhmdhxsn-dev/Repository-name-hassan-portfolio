import { cn } from "@/lib/utils";

export default function MagneticButton({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) {
  return (
    <div
      className={cn(
        "inline-flex transition-transform duration-200 ease-out hover:-translate-y-1",
        className
      )}
      data-hover
      {...props}
    >
      {children}
    </div>
  );
}

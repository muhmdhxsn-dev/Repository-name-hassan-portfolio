import * as React from "react";
import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  [key: string]: unknown;
};

const Card = React.forwardRef<HTMLElement, CardProps>(
  ({ className, as: Tag = "div", ...props }, ref) => {
    const Component = Tag as React.ElementType;
    return (
      <Component
        ref={ref}
        className={cn("glass rounded-2xl", className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export { Card };

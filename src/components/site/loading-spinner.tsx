import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

const spinnerVariants = "w-16 h-16 rounded-full animate-spin";

interface LoadingSpinnerProps extends React.HTMLAttributes<SVGSVGElement> {
  className?: string;
}

const LoadingSpinner = React.forwardRef<SVGSVGElement, LoadingSpinnerProps>(
  (props, ref) => {
    const { className, ...rest } = props;
    return (
      <Loader2Icon
        ref={ref}
        className={cn(spinnerVariants, className)}
        {...rest}
      />
    );
  }
);

LoadingSpinner.displayName = "LoadingSpinner";

export { LoadingSpinner };

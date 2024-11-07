import * as React from 'react';
import { cn } from '../../utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'bg-light-surfaceContainer mb-2 placeholder-light-inverseOnSurface text-light-primary focus:ring focus:outline-none focus:ring-light-secondary ring-light-primary border-gray-300 text-sm rounded-lg block w-full p-2.5',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
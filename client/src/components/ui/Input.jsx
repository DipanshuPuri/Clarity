import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Input Component - Redesigned for Clarity Dark Theme
 * 
 * Optimized for readability and focus visibility.
 */
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={twMerge(
                "flex h-11 w-full rounded-lg border border-border bg-surface px-4 py-2 text-sm text-slate-900 transition-all placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});

Input.displayName = "Input";

export default Input;

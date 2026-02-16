import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Button Component - Redesigned for Clarity
 * 
 * Variants:
 * - primary: Glow effect, vibrant background
 * - secondary: Subtle border, hover glow
 * - danger: Muted red, intense hover
 * - ghost: Transparent, minimal
 */
const Button = ({ children, variant = 'primary', size = 'default', className, ...props }) => {
    const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

    const variants = {
        primary: "bg-secondary text-background shadow-glow hover:brightness-110 focus:ring-secondary",
        secondary: "bg-transparent border border-border text-muted hover:border-secondary hover:text-secondary hover:shadow-[0_0_10px_rgba(46,196,198,0.1)] focus:ring-border",
        danger: "bg-danger/10 border border-danger/20 text-danger hover:bg-danger hover:text-white focus:ring-danger",
        ghost: "bg-transparent hover:bg-surface text-muted hover:text-white"
    };

    const sizes = {
        sm: "h-8 px-3 text-xs",
        default: "h-11 px-6 py-2 text-sm",
        lg: "h-13 px-10 text-base"
    };

    return (
        <button
            className={twMerge(baseStyles, variants[variant], sizes[size], className)}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;

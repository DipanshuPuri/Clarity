import React from 'react';
import { twMerge } from 'tailwind-merge';

/**
 * Card Component - Redesigned for Clarity
 * 
 * Uses 'surface' background and 'border' for subtle containment.
 */
export const Card = ({ children, className, ...props }) => {
    return (
        <div
            className={twMerge("bg-surface rounded-xl border border-border shadow-glass overflow-hidden", className)}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className }) => (
    <div className={twMerge("px-6 py-5 border-b border-border bg-white/5", className)}>
        {children}
    </div>
);

export const CardTitle = ({ children, className }) => (
    <h3 className={twMerge("text-lg font-semibold text-white tracking-tight", className)}>
        {children}
    </h3>
);

export const CardContent = ({ children, className }) => (
    <div className={twMerge("p-6", className)}>
        {children}
    </div>
);

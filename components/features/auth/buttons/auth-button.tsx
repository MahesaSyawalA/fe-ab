'use client';

import { Button, ButtonProps, Spinner } from '@heroui/react';
import { tv } from 'tailwind-variants';

const authButtonVariants = tv({
    base: 'font-semibold text-white transition-all rounded-[8px]',
    variants: {
        color: {
            primary: 'bg-primary-default hover:bg-primary-hover data-[pressed=true]:bg-primary',
        },
        fullWidth: {
            true: 'w-full',
        },
    },
    defaultVariants: {
        color: 'primary',
        fullWidth: true,
    },
});

interface AuthButtonProps extends Omit<ButtonProps, 'children'> {
    label: string;
    className?: string;
}

export function AuthButton({ label, className, isPending, ...props }: AuthButtonProps) {
    return (
        <Button
            className={authButtonVariants({ className })}
            isPending={isPending}
            {...props}
        >
            {({ isPending: pendingState }) => (
                <div className='flex justify-center items-center gap-2'>
                    {pendingState && <Spinner color='current' size='sm' />}
                    <span>{pendingState ? 'Memproses...' : label}</span>
                </div>
            )}
        </Button>
    );
}
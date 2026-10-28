import Image from 'next/image';
import { LoginForm } from '@/components/features/auth/forms/login-form';

export default function LoginPage() {
    return (
        <div className='flex w-full flex-col items-center justify-center py-6 sm:py-10'>
            <div className='mb-4 flex flex-col items-center gap-3 text-center sm:gap-5'>

                <div className='flex size-16 items-center justify-center rounded-md border border-border/80 bg-white p-1 shadow-sm sm:size-22 sm:p-1.5'>
                    <Image
                        src='/assets/logos/ab-medical-app-logo.jpeg'
                        alt='AB Medical Logo'
                        width={447}
                        height={447}
                        sizes='(min-width: 640px) 88px, 64px'
                        priority
                        className='h-full w-full object-contain'
                    />
                </div>

                <div className='flex flex-col mt-1'>
                    <h1 className='text-xl sm:text-2xl font-medium tracking-wide text-primary'>
                        AB MEDICAL
                    </h1>
                    <h2 className='text-xl sm:text-2xl font-medium tracking-wide text-primary'>
                        SALES TRACKING
                    </h2>
                </div>
            </div>

            <LoginForm />
        </div>
    );
}
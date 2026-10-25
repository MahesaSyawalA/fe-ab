import Image from 'next/image';
import { LoginForm } from '@/components/features/auth/forms/login-form';

export default function LoginPage() {
    return (
        <div className='flex w-full flex-col items-center justify-center py-10'>
            <div className='flex flex-col items-center gap-4 text-center'>
                <Image
                    src='/assets/logos/ab-medical-logo.png'
                    alt='AB Medical Logo'
                    width={78}
                    height={79}
                    priority
                    className='h-auto w-20 object-contain'
                />
                <div className='flex flex-col mt-2'>
                    <h1 className='text-xl sm:text-2xl font-medium tracking-wide text-primary-default'>
                        AB MEDICAL
                    </h1>
                    <h2 className='text-xl sm:text-2xl font-medium tracking-wide text-primary-default'>
                        SALES TRACKING
                    </h2>
                </div>
            </div>

            <LoginForm />
        </div>
    );
}
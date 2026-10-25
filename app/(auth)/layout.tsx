export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    console.log('Ini layouth untuk halaman auth');

    return (
        <main className='flex min-h-screen items-center justify-center bg-white px-4 sm:px-6 lg:px-8'>
            <div className='w-full max-w-100'>
                {children}
            </div>
        </main>
    );
}
export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    console.log('Ini layouth untuk halaman auth');

    return (
        <div>
            {children}
        </div>
    );
}
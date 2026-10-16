export default function ManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    console.log('Ini layouth untuk halaman manager');

    return (
        <div>
            {children}
        </div>
    );
}
export default function SalesLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    console.log('Ini layouth untuk halaman sales');

    return (
        <div>
            {children}
        </div>
    );
}
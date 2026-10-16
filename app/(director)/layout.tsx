export default function DirectorLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    console.log('Ini layouth untuk halaman director');

    return (
        <div>
            {children}
        </div>
    );
}
interface ProspekInfoRowProps {
  label: string;
  value: string;
  /** Jika ada, nilai dirender sebagai link (mis. `tel:`). */
  href?: string;
}

export function ProspekInfoRow({ label, value, href }: ProspekInfoRowProps) {
  return (
    <div className='flex items-center justify-between gap-4 px-4 sm:px-6 py-3.5 text-xs sm:text-sm'>
      <span className='text-muted-foreground font-medium'>{label}</span>
      {href ? (
        <a
          href={href}
          className='text-right font-semibold text-primary hover:underline'
        >
          {value}
        </a>
      ) : (
        <span className='text-right font-semibold text-foreground'>{value}</span>
      )}
    </div>
  );
}

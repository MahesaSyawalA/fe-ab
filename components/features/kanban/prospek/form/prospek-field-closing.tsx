'use client';

import { ProspekDatePicker } from '../inputs';

interface ProspekFieldClosingProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ProspekFieldClosing({
  value,
  onChange,
  error,
}: ProspekFieldClosingProps) {
  return (
    <ProspekDatePicker
      label='Target Tanggal Closing'
      isRequired
      errorMessage={error}
      hint='Baseline SLA proyeksi Q4 Tahun Anggaran 2024'
      value={value}
      onChange={onChange}
    />
  );
}

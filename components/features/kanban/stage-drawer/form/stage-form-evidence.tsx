'use client';

import * as React from 'react';
import { EvidenceFileState } from '../types';
import { StageFileInput } from '../inputs';

interface StageFormEvidenceProps {
  evidenceFile: EvidenceFileState | null;
  onEvidenceFileChange: (file: EvidenceFileState | null) => void;
  evidenceDeskripsi?: string;
  onEvidenceDeskripsiChange?: (val: string) => void;
  evidenceError: boolean;
  onEvidenceErrorChange: (err: boolean) => void;
  stageType?: string;
  label?: string;
}

export function StageFormEvidence({
  evidenceFile,
  onEvidenceFileChange,
  evidenceError,
  onEvidenceErrorChange,
  stageType,
  label,
}: StageFormEvidenceProps) {
  const displayLabel = label || (stageType === 'kebutuhan' ? 'Upload File Aktivitas' : 'Upload Bukti');

  return (
    <StageFileInput
      label={displayLabel}
      isRequired
      value={evidenceFile}
      onChange={(file) => {
        onEvidenceFileChange(file);
        if (file) {
          onEvidenceErrorChange(false);
        }
      }}
      isInvalid={evidenceError}
      errorMessage='File bukti aktivitas wajib diunggah sebelum menyimpan.'
      maxSizeInMb={10}
      accept='image/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt'
    />
  );
}

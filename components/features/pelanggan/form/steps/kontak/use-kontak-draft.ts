import * as React from 'react';
import { KontakInputItem } from '../../types';

const EMPTY_DRAFT: KontakInputItem = {
  nama: '',
  jabatan: '',
  no_telp: '',
  email: '',
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface UseKontakDraftArgs {
  contacts: KontakInputItem[];
  onChangeContacts: (contacts: KontakInputItem[]) => void;
  onSubmit: (finalContacts: KontakInputItem[]) => void;
}

/** Draft kontak yang sedang diisi + aksi tambah, hapus, dan simpan akhir daftar kontak. */
export function useKontakDraft({
  contacts,
  onChangeContacts,
  onSubmit,
}: UseKontakDraftArgs) {
  const [draft, setDraft] = React.useState<KontakInputItem>(EMPTY_DRAFT);

  const isDraftValid = React.useMemo(() => {
    const isNameValid = draft.nama.trim().length >= 1;
    // Nomor telepon minimal 9 digit angka sesuai skema Zod kontak
    const digitsCount = draft.no_telp.replace(/\D/g, '').length;
    const isPhoneValid = digitsCount >= 9;
    const isEmailValid = EMAIL_REGEX.test(draft.email.trim());

    return isNameValid && isPhoneValid && isEmailValid;
  }, [draft.nama, draft.no_telp, draft.email]);

  const canSubmit = contacts.length > 0 || isDraftValid;

  const updateDraft = (fields: Partial<KontakInputItem>) =>
    setDraft((prev) => ({ ...prev, ...fields }));

  const handleAdd = () => {
    if (!isDraftValid) return;
    onChangeContacts([...contacts, draft]);
    setDraft(EMPTY_DRAFT);
  };

  const handleRemove = (indexToRemove: number) => {
    onChangeContacts(contacts.filter((_, idx) => idx !== indexToRemove));
  };

  // Draft yang valid dan belum ditambahkan ikut tersimpan.
  const handleFinalSubmit = () => {
    const finalContacts = isDraftValid ? [...contacts, draft] : contacts;
    onChangeContacts(finalContacts);
    onSubmit(finalContacts);
  };

  return {
    draft,
    updateDraft,
    isDraftValid,
    canSubmit,
    handleAdd,
    handleRemove,
    handleFinalSubmit,
  };
}

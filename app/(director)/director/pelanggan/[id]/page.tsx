import { PelangganDetailPageContainer } from '@/components/features/pelanggan/pelanggan-detail-container';

export default function DirectorDetailPelangganPage() {
  return (
    <PelangganDetailPageContainer
      basePath='/director/pelanggan'
      canEdit={false}
    />
  );
}


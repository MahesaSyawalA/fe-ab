/**
 * Utilitas validasi berkas fleksibel & perlindungan anti-malware/script.
 * Mendukung format operasional lapangan sales (foto outlet/evidence, rekaman audio, dokumen transaksi).
 */

export const DEFAULT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/** Ekstensi berbahaya yang mutlak dilarang (anti-executable & script) */
export const DANGEROUS_EXTENSIONS = new Set([
  '.py',
  '.exe',
  '.sh',
  '.bat',
  '.cmd',
  '.php',
  '.js',
  '.ts',
  '.jsx',
  '.tsx',
  '.apk',
  '.bin',
  '.vbs',
  '.msi',
  '.jar',
  '.com',
  '.scr',
  '.pif',
  '.app',
  '.deb',
  '.rpm',
]);

/** Ekstensi gambar yang didukung (termasuk foto kamera iPhone HEIC/HEIF) */
export const ALLOWED_IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.svg',
  '.heic',
  '.heif',
]);

/** Ekstensi rekaman suara / audio yang didukung */
export const ALLOWED_AUDIO_EXTENSIONS = new Set([
  '.mp3',
  '.m4a',
  '.wav',
  '.aac',
  '.ogg',
  '.amr',
  '.3gp',
  '.wma',
  '.flac',
]);

/** Ekstensi dokumen transaksi yang didukung */
export const ALLOWED_DOC_EXTENSIONS = new Set([
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.txt',
]);

export type FileValidationCategory = 'all' | 'image-only' | 'evidence';

export interface ValidateFileOptions {
  maxSizeBytes?: number;
  category?: FileValidationCategory;
}

export interface FileValidationResult {
  isValid: boolean;
  errorMessage?: string;
}

/**
 * Format ukuran file ke string yang ramah dibaca (KB / MB).
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Ambil ekstensi berkas dalam huruf kecil dengan titik di depan (misal: ".jpg").
 */
export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot).toLowerCase();
}

/**
 * Memeriksa apakah berkas merupakan gambar yang sah berdasarkan MIME type atau ekstensi.
 */
export function isImageFile(file: File): boolean {
  if (file.type && file.type.startsWith('image/')) {
    return true;
  }
  const ext = getFileExtension(file.name);
  return ALLOWED_IMAGE_EXTENSIONS.has(ext);
}

/**
 * Memeriksa apakah berkas merupakan audio yang sah berdasarkan MIME type atau ekstensi.
 */
export function isAudioFile(file: File): boolean {
  if (file.type && file.type.startsWith('audio/')) {
    return true;
  }
  const ext = getFileExtension(file.name);
  return ALLOWED_AUDIO_EXTENSIONS.has(ext);
}

/**
 * Memeriksa apakah berkas merupakan dokumen yang diizinkan (.pdf, .doc, .docx, .xls, .xlsx, .txt).
 */
export function isDocFile(file: File): boolean {
  const ext = getFileExtension(file.name);
  if (ALLOWED_DOC_EXTENSIONS.has(ext)) {
    return true;
  }
  const docMimes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ];
  return docMimes.includes(file.type);
}

/**
 * Validasi berkas fleksibel dengan proteksi anti-malware/script.
 */
export function validateAllowedFile(
  file: File,
  options: ValidateFileOptions = {},
): FileValidationResult {
  const {
    maxSizeBytes = DEFAULT_MAX_FILE_SIZE_BYTES,
    category = 'all',
  } = options;

  if (!file) {
    return { isValid: false, errorMessage: 'Berkas tidak ditemukan' };
  }

  // 1. Validasi Batas Ukuran Berkas
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      errorMessage: `Ukuran berkas (${formatBytes(file.size)}) melebihi batas maksimal ${formatBytes(maxSizeBytes)}.`,
    };
  }

  // 2. Proteksi Mutlak Anti-Script / Anti-Executable (Blacklist)
  const ext = getFileExtension(file.name);
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    return {
      isValid: false,
      errorMessage: `Format berkas (${ext}) dilarang demi keamanan sistem. Harap unggah dokumen, foto, atau audio yang valid.`,
    };
  }

  // 3. Validasi Berdasarkan Kategori
  if (category === 'image-only') {
    if (!isImageFile(file)) {
      return {
        isValid: false,
        errorMessage: 'Harap unggah berkas gambar/foto (JPG, PNG, WEBP, atau HEIC).',
      };
    }
    return { isValid: true };
  }

  if (category === 'evidence' || category === 'all') {
    const isImage = isImageFile(file);
    const isAudio = isAudioFile(file);
    const isDoc = isDocFile(file);

    if (!isImage && !isAudio && !isDoc) {
      return {
        isValid: false,
        errorMessage: 'Format berkas tidak didukung. Harap unggah foto, rekaman suara, atau dokumen (.pdf, .doc, .docx, .xls, .xlsx, .txt).',
      };
    }
    return { isValid: true };
  }

  return { isValid: true };
}


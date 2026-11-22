export const DEFAULT_MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

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
  '.svg',
  '.html',
  '.htm',
  '.xml',
  '.xhtml',
]);

export const ALLOWED_IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.gif',
  '.heic',
  '.heif',
]);

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

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1) return '';
  return filename.slice(lastDot).toLowerCase();
}

export function isImageFile(file: File): boolean {
  const ext = getFileExtension(file.name);
  if (ext === '.svg' || file.type.toLowerCase() === 'image/svg+xml') {
    return false;
  }
  if (file.type && file.type.startsWith('image/')) {
    return true;
  }
  return ALLOWED_IMAGE_EXTENSIONS.has(ext);
}

export function isAudioFile(file: File): boolean {
  if (file.type && file.type.startsWith('audio/')) {
    return true;
  }
  const ext = getFileExtension(file.name);
  return ALLOWED_AUDIO_EXTENSIONS.has(ext);
}

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

  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      errorMessage: `Ukuran berkas (${formatBytes(file.size)}) melebihi batas maksimal ${formatBytes(maxSizeBytes)}.`,
    };
  }

  const ext = getFileExtension(file.name);
  if (DANGEROUS_EXTENSIONS.has(ext)) {
    return {
      isValid: false,
      errorMessage: `Format berkas (${ext}) dilarang demi keamanan sistem. Harap unggah dokumen, foto, atau audio yang valid.`,
    };
  }

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

export function normalizeAudioFile(file: File): File {
  const ext = getFileExtension(file.name);
  if (['.ogg', '.oga', '.opus'].includes(ext) && !file.type.startsWith('audio/')) {
    return new File([file], file.name, { type: 'audio/ogg' });
  }
  if (['.mp3'].includes(ext) && !file.type.startsWith('audio/')) {
    return new File([file], file.name, { type: 'audio/mpeg' });
  }
  if (['.wav'].includes(ext) && !file.type.startsWith('audio/')) {
    return new File([file], file.name, { type: 'audio/wav' });
  }
  if (['.m4a', '.aac'].includes(ext) && !file.type.startsWith('audio/')) {
    return new File([file], file.name, { type: 'audio/mp4' });
  }
  return file;
}

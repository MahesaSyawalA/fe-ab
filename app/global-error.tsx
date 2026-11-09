'use client';

import * as React from 'react';
import Image from 'next/image';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Global Application Error:', error);
  }, [error]);

  return (
    <html lang='id'>
      <body
        style={{
          margin: 0,
          padding: '24px',
          minHeight: '100vh',
          backgroundColor: '#FBFBFF',
          color: '#1F2937',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            maxWidth: '520px',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <div style={{ marginBottom: '20px' }}>
            <Image
              src='/assets/images/illustrations/ab-medical-root-layout-crash.png'
              alt='Terjadi Kesalahan Fatal'
              width={280}
              height={220}
              priority
              style={{
                width: 'auto',
                height: 'auto',
                maxHeight: '200px',
                maxWidth: '260px',
                objectFit: 'contain',
              }}
            />
          </div>

          <h1
            style={{
              fontSize: '24px',
              fontWeight: 700,
              margin: '0 0 10px 0',
              color: '#1F2937',
              letterSpacing: '-0.02em',
            }}
          >
            Terjadi Kesalahan Fatal
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: '#6B7280',
              margin: '0 0 28px 0',
              lineHeight: 1.6,
            }}
          >
            Maaf, sistem mengalami kendala kritis pada struktur utama. Silakan
            muat ulang halaman untuk mencoba kembali.
          </p>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <button
              type='button'
              onClick={() => reset()}
              style={{
                backgroundColor: '#ED5A21',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
                transition: 'background-color 0.15s ease',
              }}
            >
              Muat Ulang Halaman
            </button>
            <a
              href='/login'
              style={{
                backgroundColor: '#FFFFFF',
                color: '#1F2937',
                border: '1px solid #E8EAF0',
                borderRadius: '12px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s ease',
              }}
            >
              Kembali ke Login
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}


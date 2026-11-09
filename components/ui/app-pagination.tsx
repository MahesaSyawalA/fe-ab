'use client';

import * as React from 'react';
import { Pagination } from '@heroui/react';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/types/pagination.types';

export interface AppPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  meta?: PaginationMeta;
  total?: number;
  limit?: number;
  className?: string;
  showSummary?: boolean;
}

export function AppPagination({
  page,
  totalPages,
  onPageChange,
  meta,
  total,
  limit = 10,
  className,
  showSummary = true,
}: AppPaginationProps) {
  const effectiveTotal = meta?.total ?? total;
  const effectiveTotalPages = meta?.total_pages ?? totalPages;
  const effectiveLimit = meta?.limit ?? limit;

  // Jangan render pagination jika hanya ada 1 halaman atau tidak ada data
  if (effectiveTotalPages <= 1 && (!effectiveTotal || effectiveTotal <= effectiveLimit)) {
    return null;
  }

  const startItem = (page - 1) * effectiveLimit + 1;
  const endItem = effectiveTotal
    ? Math.min(page * effectiveLimit, effectiveTotal)
    : page * effectiveLimit;

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (effectiveTotalPages <= 7) {
      for (let i = 1; i <= effectiveTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push('ellipsis');
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(effectiveTotalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < effectiveTotalPages - 2) {
        pages.push('ellipsis');
      }

      pages.push(effectiveTotalPages);
    }

    return pages;
  };

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3 w-full pt-4',
        className,
      )}
    >
      {showSummary && typeof effectiveTotal === 'number' && effectiveTotal > 0 ? (
        <Pagination.Summary className='text-xs text-muted-foreground order-2 sm:order-1'>
          Menampilkan{' '}
          <span className='font-semibold text-foreground'>{startItem}</span> -{' '}
          <span className='font-semibold text-foreground'>{endItem}</span> dari{' '}
          <span className='font-semibold text-foreground'>{effectiveTotal}</span> data
        </Pagination.Summary>
      ) : (
        <div className='order-2 sm:order-1' />
      )}

      <Pagination className='justify-center order-1 sm:order-2'>
        <Pagination.Content>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={page <= 1}
              onPress={() => onPageChange(Math.max(1, page - 1))}
              className='cursor-pointer text-xs'
            >
              <Pagination.PreviousIcon />
              <span className='hidden sm:inline'>Sebelumnya</span>
            </Pagination.Previous>
          </Pagination.Item>

          {getPageNumbers().map((p, i) =>
            p === 'ellipsis' ? (
              <Pagination.Item key={`ellipsis-${i}`}>
                <Pagination.Ellipsis />
              </Pagination.Item>
            ) : (
              <Pagination.Item key={p}>
                <Pagination.Link
                  isActive={p === page}
                  onPress={() => onPageChange(p)}
                  className='cursor-pointer text-xs'
                >
                  {p}
                </Pagination.Link>
              </Pagination.Item>
            ),
          )}

          <Pagination.Item>
            <Pagination.Next
              isDisabled={page >= effectiveTotalPages}
              onPress={() => onPageChange(Math.min(effectiveTotalPages, page + 1))}
              className='cursor-pointer text-xs'
            >
              <span className='hidden sm:inline'>Berikutnya</span>
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
}


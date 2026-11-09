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
}: AppPaginationProps) {
  const effectiveTotal = meta?.total ?? total;
  const effectiveTotalPages = meta?.total_pages ?? totalPages;
  const effectiveLimit = meta?.limit ?? limit;

  // Jangan render pagination jika hanya ada 1 halaman atau tidak ada data
  if (effectiveTotalPages <= 1 && (!effectiveTotal || effectiveTotal <= effectiveLimit)) {
    return null;
  }

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];

    if (effectiveTotalPages <= 7) {
      for (let i = 1; i <= effectiveTotalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) pages.push('ellipsis');

      const start = Math.max(2, page - 1);
      const end = Math.min(effectiveTotalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (page < effectiveTotalPages - 2) pages.push('ellipsis');
      pages.push(effectiveTotalPages);
    }

    return pages;
  };

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center pt-4 pb-2',
        className,
      )}
    >
      <Pagination className='flex w-full items-center justify-center mx-auto'>
        <Pagination.Content className='!self-center self-center items-center justify-center mx-auto flex-wrap gap-1 sm:gap-1.5'>
          <Pagination.Item>
            <Pagination.Previous
              isDisabled={page <= 1}
              onPress={() => onPageChange(Math.max(1, page - 1))}
              className='cursor-pointer text-xs hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:pointer-events-none'
            >
              <Pagination.PreviousIcon />
              <span>Sebelumnya</span>
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
                  className={cn(
                    'cursor-pointer text-xs transition-colors',
                    p === page
                      ? 'data-[active=true]:[--pagination-link-bg:var(--primary)] data-[active=true]:[--pagination-link-bg-hover:var(--primary-hover)] data-[active=true]:[--pagination-link-fg:var(--primary-foreground)] data-[active=true]:!bg-primary data-[active=true]:!text-primary-foreground font-semibold shadow-xs'
                      : 'hover:text-primary hover:bg-primary/10',
                  )}
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
              className='cursor-pointer text-xs hover:text-primary hover:bg-primary/10 transition-colors disabled:opacity-40 disabled:pointer-events-none'
            >
              <span>Selanjutnya</span>
              <Pagination.NextIcon />
            </Pagination.Next>
          </Pagination.Item>
        </Pagination.Content>
      </Pagination>
    </div>
  );
}


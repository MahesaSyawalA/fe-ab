'use client';

import * as React from 'react';
import { Table } from '@heroui/react';
import { Skeleton } from '@/components/ui/skeleton';

export function UserManagementTableSkeleton() {
  const skeletonRows = Array.from({ length: 6 }, (_, i) => i);

  return (
    <Table aria-label='Memuat data pengguna' className='border border-border/70 shadow-xs'>
      <Table.ScrollContainer>
        <Table.Content aria-label='Memuat daftar pengguna' className='min-w-[700px]'>
          <Table.Header>
            <Table.Column isRowHeader id='pengguna' className='text-foreground font-semibold text-xs sm:text-sm py-3 px-4'>
              Pengguna
            </Table.Column>
            <Table.Column id='role' className='text-foreground font-semibold text-xs sm:text-sm py-3 px-4'>
              Role
            </Table.Column>
            <Table.Column id='squad' className='text-foreground font-semibold text-xs sm:text-sm py-3 px-4'>
              Squad
            </Table.Column>
            <Table.Column id='status' className='text-foreground font-semibold text-xs sm:text-sm py-3 px-4'>
              Status
            </Table.Column>
            <Table.Column id='aksi' className='text-foreground font-semibold text-xs sm:text-sm py-3 px-4 text-start'>
              Aksi
            </Table.Column>
          </Table.Header>

          <Table.Body>
            {skeletonRows.map((row) => (
              <Table.Row key={`skeleton-row-${row}`} id={`skeleton-row-${row}`}>
                <Table.Cell className='py-3.5 px-4'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <Skeleton className='size-9 rounded-full shrink-0' />
                    <div className='flex flex-col gap-1.5 min-w-0 flex-1'>
                      <Skeleton className='h-4 w-32 rounded' />
                      <Skeleton className='h-3 w-44 rounded' />
                    </div>
                  </div>
                </Table.Cell>

                <Table.Cell className='py-3.5 px-4'>
                  <Skeleton className='h-5 w-20 rounded-md' />
                </Table.Cell>

                <Table.Cell className='py-3.5 px-4'>
                  <Skeleton className='h-4 w-28 rounded' />
                </Table.Cell>

                <Table.Cell className='py-3.5 px-4'>
                  <Skeleton className='h-5 w-16 rounded-md' />
                </Table.Cell>

                <Table.Cell className='py-3.5 px-4'>
                  <div className='flex items-center justify-start gap-1.5'>
                    <Skeleton className='h-8 w-28 rounded-lg' />
                    <Skeleton className='size-8 rounded-lg' />
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table.ScrollContainer>
    </Table>
  );
}


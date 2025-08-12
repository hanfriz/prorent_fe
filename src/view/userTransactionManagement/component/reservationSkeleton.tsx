// components/reservations/component/reservationSkeleton.tsx
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const ReservationSkeleton = () => {
  // Create array of 5 skeleton rows
  const skeletonRows = Array.from({ length: 5 }, (_, i) => i);

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">
              <Skeleton className="h-4 w-3/4" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-3/4" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-3/4" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-3/4" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-3/4" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-3/4" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-3/4" />
            </TableHead>
            <TableHead className="text-right">
              <Skeleton className="h-4 w-3/4 ml-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {skeletonRows.map((row) => (
            <TableRow key={row}>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-24 rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination Skeleton */}
      <div className="flex items-center justify-between p-4 border-t">
        <Skeleton className="h-4 w-48" />
        <div className="flex items-center space-x-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  );
};

export default ReservationSkeleton;
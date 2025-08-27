// src/components/ui/pagination.tsx
import { Button } from "@/components/ui/button";

export function Pagination({ 
   page, 
   pageSize, 
   total, 
   onPageChange 
}: { 
   page: number; 
   pageSize: number; 
   total: number; 
   onPageChange: (page: number) => void;
}) {
   const totalPages = Math.ceil(total / pageSize);
   const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

   return (
      <div className="flex items-center justify-end space-x-2">
         <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
         >
            Previous
         </Button>
         {pages.map(p => (
            <Button
               key={p}
               variant={p === page ? "default" : "outline"}
               size="sm"
               onClick={() => onPageChange(p)}
            >
               {p}
            </Button>
         ))}
         <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
         >
            Next
         </Button>
      </div>
   );
}
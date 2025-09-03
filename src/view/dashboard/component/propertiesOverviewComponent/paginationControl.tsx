// src/view/report/component/PaginationControls.tsx
import { Button } from "@/components/ui/button";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  isFetching: boolean;
  onPageChange: (newPage: number) => void;
}

export function PaginationControls({ 
  currentPage, 
  totalPages, 
  isFetching, 
  onPageChange 
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between items-center mt-6">
      <PreviousButton 
        currentPage={currentPage} 
        isFetching={isFetching} 
        onClick={() => onPageChange(currentPage - 1)} 
      />
      
      <PageInfo currentPage={currentPage} totalPages={totalPages} />
      
      <NextButton 
        currentPage={currentPage} 
        totalPages={totalPages} 
        isFetching={isFetching} 
        onClick={() => onPageChange(currentPage + 1)} 
      />
    </div>
  );
}

function PreviousButton({ currentPage, isFetching, onClick }: any) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={currentPage === 1 || isFetching}
    >
      Previous
    </Button>
  );
}

function PageInfo({ currentPage, totalPages }: any) {
  return (
    <span className="text-sm text-gray-500">
      Page {currentPage} of {totalPages}
    </span>
  );
}

function NextButton({ currentPage, totalPages, isFetching, onClick }: any) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={currentPage === totalPages || isFetching}
    >
      Next
    </Button>
  );
}
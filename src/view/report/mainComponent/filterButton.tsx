// src/components/ui/filter-button.tsx
import { Button } from "@/components/ui/button";

export function FilterButton({ children, onClick, active }: {
   children: React.ReactNode;
   onClick: () => void;
   active: boolean;
}) {
   return (
      <Button
         variant={active ? "default" : "outline"}
         size="sm"
         onClick={onClick}
         className="capitalize"
      >
         {children}
      </Button>
   );
}
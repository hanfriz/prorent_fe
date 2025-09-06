import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Role } from "@/interface/enumInterface";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: Role) => void;
  isLoading?: boolean;
}

export default function RoleSelectionModal({
  isOpen,
  onClose,
  onSelectRole,
  isLoading = false,
}: RoleSelectionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Choose Your Role</DialogTitle>
          <DialogDescription>
            Please select your role to complete your account setup.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 py-4">
          <Button
            variant="outline"
            className="h-auto p-6 text-left justify-start"
            onClick={() => onSelectRole("USER")}
            disabled={isLoading}
          >
            <div>
              <div className="font-semibold">User</div>
              <div className="text-sm text-muted-foreground mt-1">
                I want to find and book properties
              </div>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto p-6 text-left justify-start"
            onClick={() => onSelectRole("OWNER")}
            disabled={isLoading}
          >
            <div>
              <div className="font-semibold">Owner</div>
              <div className="text-sm text-muted-foreground mt-1">
                I want to list and manage my properties
              </div>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

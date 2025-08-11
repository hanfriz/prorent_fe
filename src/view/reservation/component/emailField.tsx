import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  value: string;
  onChange: (email: string) => void;
  error?: string;
};

export function EmailField({ value, onChange, error }: Props) {
  return (
    <div className="grid gap-2">
      <Label>Payer Email</Label>
      <Input
        type="email"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="you@example.com"
        className={error ? "border-red-500" : ""}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

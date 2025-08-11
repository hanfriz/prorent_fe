type Props = {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
};

export function RadioGroupField({ value, onChange, options, label }: Props) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium">{label}</label>
      <div className="flex flex-col gap-2 mt-1">
        {options.map((opt) => (
          <label key={opt.value} className="flex items-center space-x-2">
            <input
              type="radio"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4"
            />
            <span className="text-sm">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

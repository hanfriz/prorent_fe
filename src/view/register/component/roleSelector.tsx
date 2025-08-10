"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Control } from "react-hook-form";
import { RegisterFormData } from "@/validation/authValidation";

const roleOptions = [
  { value: "USER", label: "User" },
  { value: "OWNER", label: "Owner" },
];

interface RoleSelectorProps {
  control: Control<RegisterFormData>;
}

export default function RoleSelector({ control }: RoleSelectorProps) {
  return (
    <FormField
      control={control}
      name="role"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Role</FormLabel>
          <FormControl>
            <Select
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Select your role"
              options={roleOptions}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

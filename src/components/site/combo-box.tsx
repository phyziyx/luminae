// Custom combobox component with a list of items to select from.
//
// TODO: Implement the custom renderFn prop to render custom items.
// - phyziyx
//

"use client";

import { ChevronsUpDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../ui/command";
import { useState } from "react";

interface ComboBoxDataType<T> {
  value: string;
  label: string;
  data?: T;
}

interface ComboBoxProps<T> {
  value: string;
  setValue: (value: string) => void;
  data: ComboBoxDataType<T>[];
  renderFn?: (value: T, checked: boolean) => React.ReactNode;
}

export default function ComboBox<T>({
  value,
  setValue,
  data,
  renderFn,
}: ComboBoxProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? data.find((e) => e.value === value)?.label || "Select..."
            : "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            <CommandGroup>
              {data.map((e) => (
                <CommandItem
                  key={e.value}
                  value={e.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === e.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {renderFn ? renderFn(e.data!, value === e.value) : e.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

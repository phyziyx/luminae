// Custom Combobox Component with Custom Styling Support
// Based on Shadcn's Combobox
// - Phyziyx

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
import clsx from "clsx";

interface ComboBoxDataType<T> {
  value: string;
  label: string;
  data?: T;
}

interface ComboBoxProps<T> {
  value: string;
  setValue: (value: string) => void;
  data: ComboBoxDataType<T>[];
  renderFn?: (
    data: T,
    checked: boolean,
    value: string,
    label: string
  ) => React.ReactNode;
  className?: string;
  modal?: boolean;
}

/**
 * When using other components like Popover, DropdownMenu, or Select
 * inside a modal/dialog, you need to set modal={true} to prevent the
 * portal from creating a new stacking context that can cause z-index
 * and focus trapping issues.
 * @author phyziyx
 */
export default function ComboBox<T>({
  value,
  setValue,
  data,
  renderFn,
  className,
  modal
}: ComboBoxProps<T>) {
  const [open, setOpen] = useState(false);

  return (
    <Popover modal={modal} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={clsx("w-full justify-between", className)}
        >
          {value
            ? data.find((e) => e.value === value)?.label || "Select..."
            : "Select..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
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
                  {renderFn
                    ? renderFn(e.data!, value === e.value, e.value, e.label)
                    : e.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

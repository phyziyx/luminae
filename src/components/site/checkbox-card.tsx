import { Check } from "lucide-react";

interface CheckboxCardProps {
  title: string;
  caption: string;
  note?: string;
  selected: boolean;
  onSelect: () => void;
}

export function CheckboxCard({
  title,
  caption,
  note,
  selected,
  onSelect,
}: CheckboxCardProps) {
  return (
    <div
      className={`border rounded-lg p-6 cursor-pointer transition-all duration-200 ${
        selected
          ? "border-blue-500 bg-blue-50 dark:bg-muted scale-105"
          : "border-blue-200 opacity-70"
      }`}
      onClick={onSelect}
    >
      <div className="flex mb-4 items-center">
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
            selected ? "border-blue-500 bg-blue-500" : "border-blue-300"
          }`}
        >
          {selected && <Check className="w-4 h-4 text-white" />}
        </div>
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-600">
          {title}
        </h2>
      </div>
      <p className="text-blue-700 dark:text-slate-200 mb-2">{caption}</p>
      {note && (
        <p className="text-sm text-blue-600 dark:text-slate-100 italic">
          {note}
        </p>
      )}
    </div>
  );
}

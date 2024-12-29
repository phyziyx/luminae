import React from "react";

interface DroppableProps {
  id: string;
  label: string;
  children: React.ReactNode;
}

export default function Droppable({ id, label, children }: DroppableProps) {
  return (
    <div className="flex flex-col w-80 p-4 bg-gray-100 rounded-lg">
      <h3 className="mb-4 text-lg font-bold">{label}</h3>
      <div
        id={id}
        className="min-h-[200px] p-2 bg-gray-200 rounded flex flex-col gap-2"
      >
        {children}
      </div>
    </div>
  );
}

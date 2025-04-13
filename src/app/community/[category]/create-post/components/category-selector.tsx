"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CategorySelectorProps {
  value: string
  onChange: (value: string) => void
}

// This would typically come from your API or database
const categories = [
  { id: "general", name: "General" },
  { id: "design", name: "Design" },
  { id: "development", name: "Development" },
  { id: "marketing", name: "Marketing" },
  { id: "business", name: "Business" },
  { id: "technology", name: "Technology" },
  { id: "lifestyle", name: "Lifestyle" },
  { id: "personal-branding", name: "Personal Branding" },
]

export default function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="category" className="text-gray-700 dark:text-gray-300">
        Select Category
      </Label>

      <Select value={value} onValueChange={onChange}>
        <SelectTrigger
          id="category"
          className="border-gray-200 dark:border-gray-700 focus:ring-primary dark:focus:ring-primary-light dark:bg-gray-800 dark:text-gray-100"
        >
          <SelectValue placeholder="Choose a category..." />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id} className="dark:text-gray-100 dark:focus:bg-gray-700">
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}


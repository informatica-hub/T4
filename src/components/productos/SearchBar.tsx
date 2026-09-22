import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({ 
  searchTerm, 
  onSearchChange, 
  placeholder = "Buscar productos...",
  className = ""
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 pr-10 py-2 w-full"
      />
      {searchTerm && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => onSearchChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
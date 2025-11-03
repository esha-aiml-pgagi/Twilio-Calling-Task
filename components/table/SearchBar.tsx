"use client";

import { Search, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { FilterPopover } from "./FilterPopover";
import { Contact } from "@/lib/table-data";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFileUpload: (file: File) => void;
  contacts: Contact[];
  selectedFilters: {
    titles: string[];
    companies: string[];
    countries: string[];
    companyCountries: string[];
    states: string[];
  };
  onApplyFilters: (filters: {
    titles: string[];
    companies: string[];
    countries: string[];
    companyCountries: string[];
    states: string[];
  }) => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  onFileUpload,
  contacts,
  selectedFilters,
  onApplyFilters,
}: SearchBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file is Excel
      const validTypes = [
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        '.xlsx',
        '.xls'
      ];
      
      const isExcel = validTypes.some(type => 
        file.type === type || file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
      );

      if (isExcel) {
        onFileUpload(file);
      } else {
        alert('Please upload only Excel files (.xlsx or .xls)');
      }
      
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="content-card p-6 mb-6">
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, title, company, email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 transition-all duration-200 focus:ring-2"
          />
        </div>
        <FilterPopover
          contacts={contacts}
          selectedFilters={selectedFilters}
          onApplyFilters={onApplyFilters}
        />
        <Button
          variant="outline"
          size="default"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 transition-all duration-200 hover:bg-accent"
        >
          <Upload className="h-4 w-4" />
          <span>Upload Excel</span>
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </div>
  );
}

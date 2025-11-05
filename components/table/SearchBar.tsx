"use client";

import { Search, Upload, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FilterPopover } from "./FilterPopover";
import { Contact } from "@/lib/table-data";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onFileUpload: (file: File) => void;
  onAddDetails: () => void;
  contacts: Contact[];
  selectedFilters: {
    titles: string[];
    companies: string[];
    countries: string[];
    companyCountries: string[];
    states: string[];
    cities: string[];
    companyStates: string[];
    companyCities: string[];
    technologies: string[];
  };
  onApplyFilters: (filters: {
    titles: string[];
    companies: string[];
    countries: string[];
    companyCountries: string[];
    states: string[];
    cities: string[];
    companyStates: string[];
    companyCities: string[];
    technologies: string[];
  }) => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  onFileUpload,
  onAddDetails,
  contacts,
  selectedFilters,
  onApplyFilters,
}: SearchBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadDropdownOpen, setIsUploadDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const uploadButtonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          uploadButtonRef.current && !uploadButtonRef.current.contains(event.target as Node)) {
        setIsUploadDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUploadDropdownOpen(false);
      }
    };

    const updateDropdownPosition = () => {
      if (uploadButtonRef.current) {
        const rect = uploadButtonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 8,
          right: window.innerWidth - rect.right,
        });
      }
    };

    if (isUploadDropdownOpen) {
      updateDropdownPosition();
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      window.addEventListener('scroll', updateDropdownPosition, true);
      window.addEventListener('resize', updateDropdownPosition);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isUploadDropdownOpen]);

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

  const handleUploadExcelClick = () => {
    setIsUploadDropdownOpen(false);
    fileInputRef.current?.click();
  };

  const handleAddDetailsClick = () => {
    setIsUploadDropdownOpen(false);
    onAddDetails();
  };

  return (
    <div className="content-card p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 animate-slideUp">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, title, company, email..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 text-sm sm:text-base transition-all duration-200 focus:ring-2"
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <FilterPopover
            contacts={contacts}
            selectedFilters={selectedFilters}
            onApplyFilters={onApplyFilters}
          />
          <Button
            ref={uploadButtonRef}
            variant="outline"
            size="default"
            onClick={() => setIsUploadDropdownOpen(!isUploadDropdownOpen)}
            className="flex items-center gap-2 transition-all duration-200 hover:bg-accent whitespace-nowrap text-sm sm:text-base"
          >
            <Upload className="h-4 w-4" />
            <span>Upload</span>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isUploadDropdownOpen ? 'rotate-180' : ''}`} />
          </Button>
          
          {isUploadDropdownOpen && typeof window !== 'undefined' && createPortal(
            <div 
              ref={dropdownRef}
              className="fixed w-52 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-[100] animate-slideDown"
              style={{
                top: `${dropdownPosition.top}px`,
                right: `${dropdownPosition.right}px`,
              }}
            >
              <button
                onClick={handleAddDetailsClick}
                className="w-full px-4 py-2.5 text-left text-sm font-medium text-foreground hover:bg-gray-100 transition-colors cursor-pointer flex items-center"
              >
                Add Details
              </button>
              <button
                onClick={handleUploadExcelClick}
                className="w-full px-4 py-2.5 text-left text-sm font-medium text-foreground hover:bg-gray-100 transition-colors cursor-pointer flex items-center"
              >
                Upload Excel
              </button>
            </div>,
            document.body
          )}
        </div>
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

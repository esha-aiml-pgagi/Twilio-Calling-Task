"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";
import { Contact } from "@/lib/table-data";
import { getUniqueValues } from "@/lib/table-utils";

interface FilterPopoverProps {
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

export function FilterPopover({
  contacts,
  selectedFilters,
  onApplyFilters,
}: FilterPopoverProps) {
  const [localFilters, setLocalFilters] = useState(selectedFilters);
  const [isOpen, setIsOpen] = useState(false);

  // Sync local filters with selected filters when popover opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(selectedFilters);
    }
  }, [isOpen, selectedFilters]);

  const titles = getUniqueValues(contacts, "title");
  const companies = getUniqueValues(contacts, "companyName");
  const countries = getUniqueValues(contacts, "country");
  const companyCountries = getUniqueValues(contacts, "companyCountry");
  const states = getUniqueValues(contacts, "state");

  const handleClearFilters = () => {
    const emptyFilters = {
      titles: [],
      companies: [],
      countries: [],
      companyCountries: [],
      states: [],
    };
    setLocalFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    setIsOpen(false);
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    setIsOpen(false);
  };

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? [] : [value],
    }));
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="default"
          className="flex items-center gap-2 transition-all duration-200 hover:bg-accent"
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 max-h-[500px] p-4" 
        align="end"
        style={{ 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div className="space-y-4" style={{ 
          overflowY: 'auto',
          overflowX: 'hidden',
          paddingRight: '8px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          
          <div className="space-y-2">
            <Label htmlFor="title-filter" className="font-medium text-sm">
              Job Title
            </Label>
            <Select
              value={localFilters.titles[0] || "all"}
              onValueChange={(value) => handleFilterChange("titles", value)}
            >
              <SelectTrigger id="title-filter" className="w-full">
                <SelectValue placeholder="Select titles..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Titles</SelectItem>
                {titles.map((title) => (
                  <SelectItem key={title} value={title}>
                    {title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-filter" className="font-medium text-sm">
              Company
            </Label>
            <Select
              value={localFilters.companies[0] || "all"}
              onValueChange={(value) => handleFilterChange("companies", value)}
            >
              <SelectTrigger id="company-filter" className="w-full">
                <SelectValue placeholder="Select companies..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {companies.map((company) => (
                  <SelectItem key={company} value={company}>
                    {company}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country-filter" className="font-medium text-sm">
              Country
            </Label>
            <Select
              value={localFilters.countries[0] || "all"}
              onValueChange={(value) => handleFilterChange("countries", value)}
            >
              <SelectTrigger id="country-filter" className="w-full">
                <SelectValue placeholder="Select countries..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company-country-filter" className="font-medium text-sm">
              Company Country
            </Label>
            <Select
              value={localFilters.companyCountries[0] || "all"}
              onValueChange={(value) =>
                handleFilterChange("companyCountries", value)
              }
            >
              <SelectTrigger id="company-country-filter" className="w-full">
                <SelectValue placeholder="Select company countries..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Company Countries</SelectItem>
                {companyCountries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="state-filter" className="font-medium text-sm">
              State
            </Label>
            <Select
              value={localFilters.states[0] || "all"}
              onValueChange={(value) => handleFilterChange("states", value)}
            >
              <SelectTrigger id="state-filter" className="w-full">
                <SelectValue placeholder="Select states..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="flex-1 transition-all duration-200"
          >
            Clear
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="flex-1 transition-all duration-200"
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { Contact } from "@/lib/table-data";
import { getUniqueValues } from "@/lib/table-utils";
import { FilterDropdown } from "./FilterDropdown";

interface FilterPopoverProps {
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

export function FilterPopover({
  contacts,
  selectedFilters,
  onApplyFilters,
}: FilterPopoverProps) {
  const [localFilters, setLocalFilters] = useState(selectedFilters);
  const [isOpen, setIsOpen] = useState(false);

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
  const cities = getUniqueValues(contacts, "city");
  const companyStates = getUniqueValues(contacts, "companyState");
  const companyCities = getUniqueValues(contacts, "companyCity");
  const technologies = getUniqueValues(contacts, "technologies");

  const handleClearFilters = () => {
    const emptyFilters = {
      titles: [],
      companies: [],
      countries: [],
      companyCountries: [],
      states: [],
      cities: [],
      companyStates: [],
      companyCities: [],
      technologies: [],
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
        className="w-80 p-0" 
        align="end"
      >
        <div className="flex flex-col max-h-[80vh]">
          <div 
            className="space-y-4 p-4 overflow-y-auto flex-1"
            style={{ 
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          
          <div className="space-y-2">
            <Label className="font-medium text-sm">Title</Label>
            <FilterDropdown
              label="Titles"
              value={localFilters.titles[0] || "all"}
              options={titles}
              onChange={(value) => handleFilterChange("titles", value)}
              placeholder="Select title..."
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">Company Name</Label>
            <FilterDropdown
              label="Companies"
              value={localFilters.companies[0] || "all"}
              options={companies}
              onChange={(value) => handleFilterChange("companies", value)}
              placeholder="Select company..."
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">City</Label>
            <FilterDropdown
              label="Cities"
              value={localFilters.cities[0] || "all"}
              options={cities}
              onChange={(value) => handleFilterChange("cities", value)}
              placeholder="Select city..."
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">State</Label>
            <FilterDropdown
              label="States"
              value={localFilters.states[0] || "all"}
              options={states}
              onChange={(value) => handleFilterChange("states", value)}
              placeholder="Select state..."
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">Country</Label>
            <FilterDropdown
              label="Countries"
              value={localFilters.countries[0] || "all"}
              options={countries}
              onChange={(value) => handleFilterChange("countries", value)}
              placeholder="Select country..."
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">Company City</Label>
            <FilterDropdown
              label="Company Cities"
              value={localFilters.companyCities[0] || "all"}
              options={companyCities}
              onChange={(value) => handleFilterChange("companyCities", value)}
              placeholder="Select company city..."
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">Company State</Label>
            <FilterDropdown
              label="Company States"
              value={localFilters.companyStates[0] || "all"}
              options={companyStates}
              onChange={(value) => handleFilterChange("companyStates", value)}
              placeholder="Select company state..."
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">Company Country</Label>
            <FilterDropdown
              label="Company Countries"
              value={localFilters.companyCountries[0] || "all"}
              options={companyCountries}
              onChange={(value) => handleFilterChange("companyCountries", value)}
              placeholder="Select company country..."
            />
          </div>

          <div className="space-y-2">
            <Label className="font-medium text-sm">Technologies</Label>
            <FilterDropdown
              label="Technologies"
              value={localFilters.technologies[0] || "all"}
              options={technologies}
              onChange={(value) => handleFilterChange("technologies", value)}
              placeholder="Select technology..."
            />
          </div>
        </div>

        <div className="flex gap-2 p-4 border-t bg-white rounded-b-md">
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
      </div>
      </PopoverContent>
    </Popover>
  );
}

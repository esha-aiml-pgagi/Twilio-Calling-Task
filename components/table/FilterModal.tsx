"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Contact } from "@/lib/table-data";
import { getUniqueValues } from "@/lib/table-utils";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
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

export function FilterModal({
  isOpen,
  onClose,
  contacts,
  selectedFilters,
  onApplyFilters,
}: FilterModalProps) {
  const [localFilters, setLocalFilters] = useState(selectedFilters);

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
    onClose();
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const handleFilterChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? [] : [value],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto transition-all duration-300 modal-background">
        <DialogHeader>
          <DialogTitle>Filter Results</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title-filter" className="font-medium">
              Job Title
            </Label>
            <Select
              value={localFilters.titles[0] || "all"}
              onValueChange={(value) => handleFilterChange("titles", value)}
            >
              <SelectTrigger id="title-filter">
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
            <Label htmlFor="company-filter" className="font-medium">
              Company
            </Label>
            <Select
              value={localFilters.companies[0] || "all"}
              onValueChange={(value) => handleFilterChange("companies", value)}
            >
              <SelectTrigger id="company-filter">
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
            <Label htmlFor="country-filter" className="font-medium">
              Country
            </Label>
            <Select
              value={localFilters.countries[0] || "all"}
              onValueChange={(value) => handleFilterChange("countries", value)}
            >
              <SelectTrigger id="country-filter">
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
            <Label htmlFor="company-country-filter" className="font-medium">
              Company Country
            </Label>
            <Select
              value={localFilters.companyCountries[0] || "all"}
              onValueChange={(value) =>
                handleFilterChange("companyCountries", value)
              }
            >
              <SelectTrigger id="company-country-filter">
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
            <Label htmlFor="state-filter" className="font-medium">
              State
            </Label>
            <Select
              value={localFilters.states[0] || "all"}
              onValueChange={(value) => handleFilterChange("states", value)}
            >
              <SelectTrigger id="state-filter">
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

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleClearFilters}
            className="transition-all duration-200"
          >
            Clear Filters
          </Button>
          <Button
            onClick={handleApplyFilters}
            className="transition-all duration-200"
          >
            Apply Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

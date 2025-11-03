"use client";

import { useState, useMemo, useEffect } from "react";
import { SearchBar } from "@/components/table/SearchBar";
import { DataTable } from "@/components/table/DataTable";
import { SocialMediaModal } from "@/components/table/SocialMediaModal";
import { contactsData, Contact } from "@/lib/table-data";
import { filterContacts } from "@/lib/table-utils";
import { useDebounce } from "@/hooks/useDebounce";
import * as XLSX from 'xlsx';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 50;

export default function TablePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<{
    titles: string[];
    companies: string[];
    countries: string[];
    companyCountries: string[];
    states: string[];
  }>({
    titles: [],
    companies: [],
    countries: [],
    companyCountries: [],
    states: [],
  });
  const [contacts, setContacts] = useState<Contact[]>(contactsData);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredData = useMemo(() => {
    return filterContacts(contacts, debouncedSearchQuery, selectedFilters);
  }, [contacts, debouncedSearchQuery, selectedFilters]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedFilters]);

  const handleSocialClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsSocialModalOpen(true);
  };

  const handleApplyFilters = (filters: typeof selectedFilters) => {
    setSelectedFilters(filters);
  };

  const handleFileUpload = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const newContacts: Contact[] = jsonData.map((row: any, index: number) => {
        const newId = `excel-${Date.now()}-${index}`;

        const getField = (possibleNames: string[]) => {
          for (const name of possibleNames) {
            const value = row[name] || row[name.toLowerCase()] || row[name.toUpperCase()];
            if (value !== undefined && value !== null) return String(value);
          }
          return "";
        };

        const firstName = getField(["First Name", "FirstName", "firstName", "first_name"]);
        const lastName = getField(["Last Name", "LastName", "lastName", "last_name"]);
        const fullName = getField(["Name", "Full Name", "name", "fullName"]) || `${firstName} ${lastName}`.trim();

        return {
          id: newId,
          name: fullName,
          firstName,
          lastName,
          title: getField(["Title", "Job Title", "Position", "title"]),
          companyName: getField(["Company Name", "Company", "companyName", "company"]),
          email: getField(["Email", "Email Address", "email"]),
          corporatePhone: getField(["Corporate Phone", "Phone", "corporatePhone", "phone"]),
          personLinkedIn: getField(["Person LinkedIn", "LinkedIn", "personLinkedIn", "linkedin"]),
          website: getField(["Website", "Company Website", "website"]),
          companyLinkedin: getField(["Company LinkedIn", "companyLinkedin"]),
          socialMedia: [],
          city: getField(["City", "city"]),
          state: getField(["State", "state"]),
          country: getField(["Country", "country"]),
          companyAddress: getField(["Company Address", "Address", "companyAddress", "address"]),
          companyCity: getField(["Company City", "companyCity"]),
          companyState: getField(["Company State", "companyState"]),
          companyCountry: getField(["Company Country", "companyCountry"]),
          companyPhone: getField(["Company Phone", "companyPhone"]),
          facebookUrl: getField(["Facebook URL", "Facebook", "facebookUrl"]),
          twitterUrl: getField(["Twitter URL", "Twitter", "twitterUrl"]),
          technologies: getField(["Technologies", "technologies"]),
          annualRevenue: getField(["Annual Revenue", "annualRevenue"]),
          totalFunding: getField(["Total Funding", "totalFunding"]),
          latestFunding: getField(["Latest Funding", "latestFunding"]),
          latestFundingAmount: getField(["Latest Funding Amount", "latestFundingAmount"]),
          lastRaisedAt: getField(["Last Raised At", "lastRaisedAt"]),
          subsidiaryOf: getField(["Subsidiary of", "subsidiaryOf"]),
          emailSent: getField(["Email Sent", "emailSent"]),
          emailOpen: getField(["Email Open", "emailOpen"]),
          emailBounced: getField(["Email Bounced", "emailBounced"]),
          replied: getField(["Replied", "replied"]),
          demoed: getField(["Demoed", "demoed"]),
          numberOfRetailLocations: getField(["Number of Retail Locations", "numberOfRetailLocations"]),
          apolloContactId: getField(["Apollo Contact ID", "apolloContactId"]),
          apolloAccountId: getField(["Apollo Account ID", "apolloAccountId"]),
          secondaryEmail: getField(["Secondary Email", "secondaryEmail"]),
          secondaryEmailSource: getField(["Secondary Email Source", "secondaryEmailSource"]),
          secondaryEmailStatus: getField(["Secondary Email Status", "secondaryEmailStatus"]),
          secondaryEmailVerificationSource: getField(["Secondary Email Verification Source", "secondaryEmailVerificationSource"]),
          tertiaryEmail: getField(["Tertiary Email", "tertiaryEmail"]),
          tertiaryEmailSource: getField(["Tertiary Email Source", "tertiaryEmailSource"]),
          tertiaryEmailStatus: getField(["Tertiary Email Status", "tertiaryEmailStatus"]),
          tertiaryEmailVerificationSource: getField(["Tertiary Email Verification Source", "tertiaryEmailVerificationSource"]),
          primaryIntentTopic: getField(["Primary Intent Topic", "primaryIntentTopic"]),
          primaryIntentScore: getField(["Primary Intent Score", "primaryIntentScore"]),
          secondaryIntentTopic: getField(["Secondary Intent Topic", "secondaryIntentTopic"]),
          secondaryIntentScore: getField(["Secondary Intent Score", "secondaryIntentScore"]),
        };
      });

      setContacts(prevContacts => [...prevContacts, ...newContacts]);
      alert(`Successfully uploaded ${newContacts.length} contacts from Excel file!`);
    } catch (error) {
      console.error("Error parsing Excel file:", error);
      alert("Failed to parse Excel file. Please ensure it's a valid Excel file.");
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis-start">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-end">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <div className="page-background p-6">
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onFileUpload={handleFileUpload}
        contacts={contacts}
        selectedFilters={selectedFilters}
        onApplyFilters={handleApplyFilters}
      />

      <DataTable data={paginatedData} onSocialClick={handleSocialClick} />

      {totalPages > 1 && (
        <div className="content-card p-4 mt-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredData.length)} of {filteredData.length} entries
          </p>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <SocialMediaModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        contact={selectedContact}
      />
    </div>
  );
}

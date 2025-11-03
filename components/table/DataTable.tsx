"use client";

import React, { useState, useEffect } from "react";
import { Link as LinkIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Contact } from "@/lib/table-data";
import { ExpandableAddressCell } from "./ExpandableAddressCell";
import { NotesCell } from "./NotesCell";
import { StatusDropdown } from "./StatusDropdown";

interface DataTableProps {
  data: Contact[];
  onSocialClick: (contact: Contact) => void;
}

export function DataTable({ data, onSocialClick }: DataTableProps) {
  const [contacts, setContacts] = useState<Contact[]>(data);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [collapsingRows, setCollapsingRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    setContacts(data);
  }, [data]);

  const handleStatusChange = (id: string, status: "contacted" | "not contacted" | "lost") => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, status } : contact
      )
    );
  };

  const handleNotesChange = (id: string, notes: string) => {
    setContacts((prev) =>
      prev.map((contact) =>
        contact.id === id ? { ...contact, notes } : contact
      )
    );
  };

  const toggleViewMore = (id: string) => {
    if (expandedRows.has(id)) {
      // Start collapse animation
      setCollapsingRows((prev) => new Set(prev).add(id));
      
      // After animation completes, remove from expanded
      setTimeout(() => {
        setExpandedRows((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
        setCollapsingRows((prev) => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 300); // Match animation duration
    } else {
      // Expand immediately
      setExpandedRows((prev) => new Set(prev).add(id));
    }
  };

  return (
    <div className="content-card p-3 sm:p-4 md:p-6 animate-slideUp-delay-1" style={{ overflow: 'visible', position: 'relative', zIndex: 1 }}>
      <div className="table-wrapper-no-scrollbar overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-bold min-w-[120px] sm:min-w-[150px] text-xs sm:text-sm">Name</TableHead>
              <TableHead className="font-bold min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm">Title</TableHead>
              <TableHead className="font-bold min-w-[140px] sm:min-w-[180px] text-xs sm:text-sm">Company Name</TableHead>
              <TableHead className="font-bold min-w-[160px] sm:min-w-[200px] text-xs sm:text-sm">Email</TableHead>
              <TableHead className="font-bold min-w-[120px] sm:min-w-[140px] text-xs sm:text-sm">Corporate Phone</TableHead>
              <TableHead className="font-bold min-w-[120px] sm:min-w-[150px] text-xs sm:text-sm">Address</TableHead>
              <TableHead className="font-bold min-w-[140px] sm:min-w-[180px] text-xs sm:text-sm">Company Address</TableHead>
              <TableHead className="font-bold min-w-[80px] sm:min-w-[100px] text-xs sm:text-sm">Social Media</TableHead>
              <TableHead className="font-bold min-w-[140px] sm:min-w-[160px] text-xs sm:text-sm">Status</TableHead>
              <TableHead className="font-bold min-w-[160px] sm:min-w-[200px] text-xs sm:text-sm">Notes</TableHead>
              <TableHead className="font-bold min-w-[100px] sm:min-w-[120px] text-xs sm:text-sm">View More</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contacts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
                  No results found
                </TableCell>
              </TableRow>
            ) : (
              contacts.map((contact) => {
                const isExpanded = expandedRows.has(contact.id);
                const isCollapsing = collapsingRows.has(contact.id);
                const shouldShowCard = isExpanded || isCollapsing;
                
                const additionalFields = [
                  { label: "First Name", value: contact.firstName },
                  { label: "Last Name", value: contact.lastName },
                  { label: "Title", value: contact.title },
                  { label: "Company Name", value: contact.companyName },
                  { label: "Email", value: contact.email },
                  { label: "Corporate Phone", value: contact.corporatePhone },
                  { label: "Person LinkedIn URL", value: contact.personLinkedIn },
                  { label: "Website", value: contact.website },
                  { label: "Company LinkedIn URL", value: contact.companyLinkedin },
                  { label: "Facebook URL", value: contact.facebookUrl },
                  { label: "Twitter URL", value: contact.twitterUrl },
                  { label: "City", value: contact.city },
                  { label: "State", value: contact.state },
                  { label: "Country", value: contact.country },
                  { label: "Company Address", value: contact.companyAddress },
                  { label: "Company City", value: contact.companyCity },
                  { label: "Company State", value: contact.companyState },
                  { label: "Company Country", value: contact.companyCountry },
                  { label: "Company Phone", value: contact.companyPhone },
                  { label: "Technologies", value: contact.technologies },
                  { label: "Annual Revenue", value: contact.annualRevenue },
                  { label: "Total Funding", value: contact.totalFunding },
                  { label: "Latest Funding", value: contact.latestFunding },
                  { label: "Latest Funding Amount", value: contact.latestFundingAmount },
                  { label: "Last Raised At", value: contact.lastRaisedAt },
                  { label: "Subsidiary of", value: contact.subsidiaryOf },
                  { label: "Email Sent", value: contact.emailSent },
                  { label: "Email Open", value: contact.emailOpen },
                  { label: "Email Bounced", value: contact.emailBounced },
                  { label: "Replied", value: contact.replied },
                  { label: "Demoed", value: contact.demoed },
                  { label: "Number of Retail Locations", value: contact.numberOfRetailLocations },
                  { label: "Apollo Contact ID", value: contact.apolloContactId },
                  { label: "Apollo Account ID", value: contact.apolloAccountId },
                  { label: "Secondary Email", value: contact.secondaryEmail },
                  { label: "Secondary Email Source", value: contact.secondaryEmailSource },
                  { label: "Secondary Email Status", value: contact.secondaryEmailStatus },
                  { label: "Secondary Email Verification Source", value: contact.secondaryEmailVerificationSource },
                  { label: "Tertiary Email", value: contact.tertiaryEmail },
                  { label: "Tertiary Email Source", value: contact.tertiaryEmailSource },
                  { label: "Tertiary Email Status", value: contact.tertiaryEmailStatus },
                  { label: "Tertiary Email Verification Source", value: contact.tertiaryEmailVerificationSource },
                  { label: "Primary Intent Topic", value: contact.primaryIntentTopic },
                  { label: "Primary Intent Score", value: contact.primaryIntentScore },
                  { label: "Secondary Intent Topic", value: contact.secondaryIntentTopic },
                  { label: "Secondary Intent Score", value: contact.secondaryIntentScore },
                ];

                return (
                  <React.Fragment key={contact.id}>
                    <TableRow
                      className="transition-colors duration-200 hover:bg-gray-50"
                    >
                      <TableCell className="font-medium text-xs sm:text-sm">{contact.name}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{contact.title}</TableCell>
                      <TableCell className="text-xs sm:text-sm">{contact.companyName}</TableCell>
                      <TableCell>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-600 hover:underline text-xs sm:text-sm transition-all duration-200 break-all"
                        >
                          {contact.email}
                        </a>
                      </TableCell>
                      <TableCell>
                        <a
                          href={`tel:${contact.corporatePhone}`}
                          className="text-blue-600 hover:underline text-xs sm:text-sm transition-all duration-200"
                        >
                          {contact.corporatePhone}
                        </a>
                      </TableCell>
                      <TableCell>
                        <ExpandableAddressCell
                          type="personal"
                          displayText={contact.city}
                          city={contact.city}
                          state={contact.state}
                          country={contact.country}
                        />
                      </TableCell>
                      <TableCell>
                        <ExpandableAddressCell
                          type="company"
                          displayText={contact.companyAddress}
                          fullAddress={contact.companyAddress}
                          companyCity={contact.companyCity}
                          companyState={contact.companyState}
                          companyCountry={contact.companyCountry}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSocialClick(contact)}
                          className="transition-all duration-200 hover:bg-accent h-8 w-8 sm:h-10 sm:w-10"
                        >
                          <LinkIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </TableCell>
                      <TableCell>
                        <StatusDropdown
                          value={contact.status}
                          onChange={(status) => handleStatusChange(contact.id, status)}
                        />
                      </TableCell>
                      <TableCell>
                        <NotesCell
                          value={contact.notes || ""}
                          onChange={(notes) => handleNotesChange(contact.id, notes)}
                        />
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => toggleViewMore(contact.id)}
                          className="text-xs sm:text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        >
                          {isExpanded ? "Hide" : "View More"}
                        </button>
                      </TableCell>
                    </TableRow>
                    {shouldShowCard && (
                      <TableRow key={`${contact.id}-expanded`}>
                        <TableCell
                          colSpan={11}
                          className="bg-gray-50/50 p-0 transition-all duration-300"
                        >
                          <div className={`${
                            isCollapsing 
                              ? 'animate-out fade-out slide-out-to-top-2 duration-300' 
                              : 'animate-in fade-in slide-in-from-top-2 duration-300'
                          }`}>
                            <div className="p-3 sm:p-4 md:p-6 bg-white rounded-lg mx-2 sm:mx-3 md:mx-4 my-2 sm:my-3 md:my-4 shadow-sm border">
                              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-2 sm:gap-y-3 md:gap-y-4">
                                {additionalFields.map((field, index) => (
                                  <div key={index} className="text-xs sm:text-sm break-words">
                                    <span className="font-medium">{field.label}:</span>{" "}
                                    <span className="text-muted-foreground">
                                      {field.value || "—"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

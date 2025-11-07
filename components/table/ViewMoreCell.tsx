"use client";

import { useState } from "react";
import { Contact } from "@/lib/table-data";

interface ViewMoreCellProps {
  contact: Contact;
}

export function ViewMoreCell({ contact }: ViewMoreCellProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const visibleFields = additionalFields.filter(field => field.value);

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
      >
        {isExpanded ? "Hide" : "View More"}
      </button>

      <div 
        className={`overflow-hidden transition-all duration-350 ease-in-out ${
          isExpanded ? 'max-h-[2000px] opacity-100 mt-4' : 'max-h-0 opacity-0 mt-0'
        }`}
      >
        <div className={`bg-white/95 backdrop-blur-md border rounded-lg shadow-lg p-6 transition-all duration-350 ease-in-out ${
          isExpanded ? 'scale-100 translate-y-0' : 'scale-95 -translate-y-2'
        }`}>
          <div className="grid grid-cols-3 gap-x-8 gap-y-4">
            {visibleFields.map((field, index) => (
              <div key={index} className="text-sm">
                <span className="font-medium">{field.label}:</span>{" "}
                <span className="text-muted-foreground">{field.value || "N/A"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

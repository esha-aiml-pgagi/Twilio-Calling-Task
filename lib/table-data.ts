export interface SocialMediaLink {
  platform: string;
  url: string;
}

export interface Contact {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  title: string;
  companyName: string;
  email: string;
  corporatePhone: string;
  personLinkedIn: string;
  website: string;
  companyLinkedin: string;
  socialMedia: SocialMediaLink[];
  city: string;
  state: string;
  country: string;
  companyAddress: string;
  companyCity: string;
  companyState: string;
  companyCountry: string;
  companyPhone: string;
  facebookUrl?: string;
  twitterUrl?: string;
  technologies?: string;
  annualRevenue?: string;
  totalFunding?: string;
  latestFunding?: string;
  latestFundingAmount?: string;
  lastRaisedAt?: string;
  subsidiaryOf?: string;
  emailSent?: string;
  emailOpen?: string;
  emailBounced?: string;
  replied?: string;
  demoed?: string;
  numberOfRetailLocations?: string;
  apolloContactId?: string;
  apolloAccountId?: string;
  secondaryEmail?: string;
  secondaryEmailSource?: string;
  secondaryEmailStatus?: string;
  secondaryEmailVerificationSource?: string;
  tertiaryEmail?: string;
  tertiaryEmailSource?: string;
  tertiaryEmailStatus?: string;
  tertiaryEmailVerificationSource?: string;
  primaryIntentTopic?: string;
  primaryIntentScore?: string;
  secondaryIntentTopic?: string;
  secondaryIntentScore?: string;
  status?: "contacted" | "not contacted" | "lost";
  notes?: string;
}

export const contactsData: Contact[] = [
  {
    id: "1",
    name: "Giridhar Thota",
    firstName: "Giridhar",
    lastName: "Thota",
    title: "CEO",
    companyName: "Shodhana Laboratories Limited",
    email: "giridhar@shodhana.com",
    corporatePhone: "+91 40 2304 5678",
    personLinkedIn: "https://www.linkedin.com/in/giridhar-thota",
    website: "https://www.shodhana.com",
    companyLinkedin: "https://www.linkedin.com/company/shodhana-laboratories",
    socialMedia: [
      { platform: "Twitter", url: "https://twitter.com/shodhana" },
      { platform: "Facebook", url: "https://facebook.com/shodhana" },
      { platform: "Instagram", url: "https://instagram.com/shodhana" },
    ],
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    companyAddress: "Plot No. 123, IDA Jeedimetla",
    companyCity: "Hyderabad",
    companyState: "Telangana",
    companyCountry: "India",
    companyPhone: "+91 40 2304 5678",
  },
  {
    id: "2",
    name: "Waman Sanap",
    firstName: "Waman",
    lastName: "Sanap",
    title: "Chief Executive",
    companyName: "IPAC Automation",
    email: "waman@ipacautomation.com",
    corporatePhone: "+91 20 2567 8901",
    personLinkedIn: "https://www.linkedin.com/in/waman-sanap",
    website: "https://www.ipacautomation.com",
    companyLinkedin: "https://www.linkedin.com/company/ipac-automation",
    socialMedia: [
      { platform: "LinkedIn", url: "https://linkedin.com/company/ipac" },
      { platform: "Twitter", url: "https://twitter.com/ipacautomation" },
    ],
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    companyAddress: "Survey No. 45, Pimpri",
    companyCity: "Pune",
    companyState: "Maharashtra",
    companyCountry: "India",
    companyPhone: "+91 20 2567 8901",
  },
  {
    id: "3",
    name: "Vijai S",
    firstName: "Vijai",
    lastName: "S",
    title: "CEO",
    companyName: "Royaloak",
    email: "vijai@royaloak.com",
    corporatePhone: "+91 80 4123 4567",
    personLinkedIn: "https://www.linkedin.com/in/vijai-s",
    website: "https://www.royaloak.com",
    companyLinkedin: "https://www.linkedin.com/company/royaloak",
    socialMedia: [
      { platform: "Facebook", url: "https://facebook.com/royaloak" },
      { platform: "Instagram", url: "https://instagram.com/royaloak" },
      { platform: "Twitter", url: "https://twitter.com/royaloak" },
      { platform: "LinkedIn", url: "https://linkedin.com/company/royaloak" },
    ],
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    companyAddress: "No. 78, Industrial Estate",
    companyCity: "Bangalore",
    companyState: "Karnataka",
    companyCountry: "India",
    companyPhone: "+91 80 4123 4567",
  },
];

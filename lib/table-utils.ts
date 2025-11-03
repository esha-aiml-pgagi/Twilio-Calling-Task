import { Contact } from "./table-data";

export function filterContacts(
  contacts: Contact[],
  searchQuery: string,
  filters: {
    titles: string[];
    companies: string[];
    countries: string[];
    companyCountries: string[];
    states: string[];
  }
): Contact[] {
  return contacts.filter((contact) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      contact.name.toLowerCase().includes(searchLower) ||
      contact.title.toLowerCase().includes(searchLower) ||
      contact.companyName.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower);

    // Apply filters
    const matchesTitle =
      filters.titles.length === 0 || filters.titles.includes(contact.title);
    const matchesCompany =
      filters.companies.length === 0 ||
      filters.companies.includes(contact.companyName);
    const matchesCountry =
      filters.countries.length === 0 ||
      filters.countries.includes(contact.country);
    const matchesCompanyCountry =
      filters.companyCountries.length === 0 ||
      filters.companyCountries.includes(contact.companyCountry);
    const matchesState =
      filters.states.length === 0 || filters.states.includes(contact.state);

    return (
      matchesSearch &&
      matchesTitle &&
      matchesCompany &&
      matchesCountry &&
      matchesCompanyCountry &&
      matchesState
    );
  });
}

export function getUniqueValues(contacts: Contact[], key: keyof Contact): string[] {
  const values = contacts.map((contact) => contact[key]);
  return Array.from(new Set(values.filter(Boolean) as string[])).sort();
}

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Contact } from "@/lib/table-data";

interface AddDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (contact: Contact) => void;
}

export function AddDetailsModal({ isOpen, onClose, onAddContact }: AddDetailsModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    firstName: "",
    lastName: "",
    title: "",
    companyName: "",
    email: "",
    corporatePhone: "",
    personLinkedIn: "",
    website: "",
    companyLinkedin: "",
    city: "",
    state: "",
    country: "",
    companyAddress: "",
    companyCity: "",
    companyState: "",
    companyCountry: "",
    companyPhone: "",
    facebookUrl: "",
    twitterUrl: "",
    technologies: "",
    annualRevenue: "",
    totalFunding: "",
    latestFunding: "",
    latestFundingAmount: "",
    lastRaisedAt: "",
    subsidiaryOf: "",
    numberOfRetailLocations: "",
    apolloContactId: "",
    apolloAccountId: "",
    secondaryEmail: "",
    secondaryEmailSource: "",
    secondaryEmailStatus: "",
    secondaryEmailVerificationSource: "",
    tertiaryEmail: "",
    tertiaryEmailSource: "",
    tertiaryEmailStatus: "",
    tertiaryEmailVerificationSource: "",
    primaryIntentTopic: "",
    primaryIntentScore: "",
    secondaryIntentTopic: "",
    secondaryIntentScore: "",
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors([]);
  };

  const handleSubmit = () => {
    // Validation: At least name or email must be provided
    if (!formData.name.trim() && !formData.email.trim()) {
      setErrors(["Please provide at least a Name or Email"]);
      return;
    }

    // Create new contact
    const newContact: Contact = {
      id: `manual-${Date.now()}`,
      name: formData.name || "",
      firstName: formData.firstName || undefined,
      lastName: formData.lastName || undefined,
      title: formData.title || "",
      companyName: formData.companyName || "",
      email: formData.email || "",
      corporatePhone: formData.corporatePhone || "",
      personLinkedIn: formData.personLinkedIn || "",
      website: formData.website || "",
      companyLinkedin: formData.companyLinkedin || "",
      socialMedia: [],
      city: formData.city || "",
      state: formData.state || "",
      country: formData.country || "",
      companyAddress: formData.companyAddress || "",
      companyCity: formData.companyCity || "",
      companyState: formData.companyState || "",
      companyCountry: formData.companyCountry || "",
      companyPhone: formData.companyPhone || "",
      facebookUrl: formData.facebookUrl || undefined,
      twitterUrl: formData.twitterUrl || undefined,
      technologies: formData.technologies || undefined,
      annualRevenue: formData.annualRevenue || undefined,
      totalFunding: formData.totalFunding || undefined,
      latestFunding: formData.latestFunding || undefined,
      latestFundingAmount: formData.latestFundingAmount || undefined,
      lastRaisedAt: formData.lastRaisedAt || undefined,
      subsidiaryOf: formData.subsidiaryOf || undefined,
      numberOfRetailLocations: formData.numberOfRetailLocations || undefined,
      apolloContactId: formData.apolloContactId || undefined,
      apolloAccountId: formData.apolloAccountId || undefined,
      secondaryEmail: formData.secondaryEmail || undefined,
      secondaryEmailSource: formData.secondaryEmailSource || undefined,
      secondaryEmailStatus: formData.secondaryEmailStatus || undefined,
      secondaryEmailVerificationSource: formData.secondaryEmailVerificationSource || undefined,
      tertiaryEmail: formData.tertiaryEmail || undefined,
      tertiaryEmailSource: formData.tertiaryEmailSource || undefined,
      tertiaryEmailStatus: formData.tertiaryEmailStatus || undefined,
      tertiaryEmailVerificationSource: formData.tertiaryEmailVerificationSource || undefined,
      primaryIntentTopic: formData.primaryIntentTopic || undefined,
      primaryIntentScore: formData.primaryIntentScore || undefined,
      secondaryIntentTopic: formData.secondaryIntentTopic || undefined,
      secondaryIntentScore: formData.secondaryIntentScore || undefined,
    };

    onAddContact(newContact);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      name: "",
      firstName: "",
      lastName: "",
      title: "",
      companyName: "",
      email: "",
      corporatePhone: "",
      personLinkedIn: "",
      website: "",
      companyLinkedin: "",
      city: "",
      state: "",
      country: "",
      companyAddress: "",
      companyCity: "",
      companyState: "",
      companyCountry: "",
      companyPhone: "",
      facebookUrl: "",
      twitterUrl: "",
      technologies: "",
      annualRevenue: "",
      totalFunding: "",
      latestFunding: "",
      latestFundingAmount: "",
      lastRaisedAt: "",
      subsidiaryOf: "",
      numberOfRetailLocations: "",
      apolloContactId: "",
      apolloAccountId: "",
      secondaryEmail: "",
      secondaryEmailSource: "",
      secondaryEmailStatus: "",
      secondaryEmailVerificationSource: "",
      tertiaryEmail: "",
      tertiaryEmailSource: "",
      tertiaryEmailStatus: "",
      tertiaryEmailVerificationSource: "",
      primaryIntentTopic: "",
      primaryIntentScore: "",
      secondaryIntentTopic: "",
      secondaryIntentScore: "",
    });
    setErrors([]);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">Add Contact Details</h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Content - Scrollable */}
        <div className="overflow-y-auto flex-1 p-6">
          {errors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              {errors.map((error, index) => (
                <p key={index} className="text-sm text-red-600">
                  {error}
                </p>
              ))}
            </div>
          )}

          {/* Personal Information */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-4 text-foreground">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  placeholder="John"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  placeholder="Doe"
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  placeholder="CEO"
                />
              </div>
              <div>
                <Label htmlFor="corporatePhone">Corporate Phone</Label>
                <Input
                  id="corporatePhone"
                  value={formData.corporatePhone}
                  onChange={(e) => handleChange("corporatePhone", e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div>
                <Label htmlFor="personLinkedIn">LinkedIn URL</Label>
                <Input
                  id="personLinkedIn"
                  type="url"
                  value={formData.personLinkedIn}
                  onChange={(e) => handleChange("personLinkedIn", e.target.value)}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="New York"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value)}
                  placeholder="NY"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.country}
                  onChange={(e) => handleChange("country", e.target.value)}
                  placeholder="USA"
                />
              </div>
            </div>
          </div>

          {/* Company Information */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-4 text-foreground">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <Label htmlFor="companyLinkedin">Company LinkedIn</Label>
                <Input
                  id="companyLinkedin"
                  type="url"
                  value={formData.companyLinkedin}
                  onChange={(e) => handleChange("companyLinkedin", e.target.value)}
                  placeholder="https://linkedin.com/company/acme"
                />
              </div>
              <div>
                <Label htmlFor="companyPhone">Company Phone</Label>
                <Input
                  id="companyPhone"
                  value={formData.companyPhone}
                  onChange={(e) => handleChange("companyPhone", e.target.value)}
                  placeholder="+1 234 567 8900"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="companyAddress">Company Address</Label>
                <Input
                  id="companyAddress"
                  value={formData.companyAddress}
                  onChange={(e) => handleChange("companyAddress", e.target.value)}
                  placeholder="123 Main St"
                />
              </div>
              <div>
                <Label htmlFor="companyCity">Company City</Label>
                <Input
                  id="companyCity"
                  value={formData.companyCity}
                  onChange={(e) => handleChange("companyCity", e.target.value)}
                  placeholder="San Francisco"
                />
              </div>
              <div>
                <Label htmlFor="companyState">Company State</Label>
                <Input
                  id="companyState"
                  value={formData.companyState}
                  onChange={(e) => handleChange("companyState", e.target.value)}
                  placeholder="CA"
                />
              </div>
              <div>
                <Label htmlFor="companyCountry">Company Country</Label>
                <Input
                  id="companyCountry"
                  value={formData.companyCountry}
                  onChange={(e) => handleChange("companyCountry", e.target.value)}
                  placeholder="USA"
                />
              </div>
              <div>
                <Label htmlFor="subsidiaryOf">Subsidiary Of</Label>
                <Input
                  id="subsidiaryOf"
                  value={formData.subsidiaryOf}
                  onChange={(e) => handleChange("subsidiaryOf", e.target.value)}
                  placeholder="Parent Company"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-4 text-foreground">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="facebookUrl">Facebook URL</Label>
                <Input
                  id="facebookUrl"
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => handleChange("facebookUrl", e.target.value)}
                  placeholder="https://facebook.com/company"
                />
              </div>
              <div>
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input
                  id="twitterUrl"
                  type="url"
                  value={formData.twitterUrl}
                  onChange={(e) => handleChange("twitterUrl", e.target.value)}
                  placeholder="https://twitter.com/company"
                />
              </div>
              <div>
                <Label htmlFor="technologies">Technologies</Label>
                <Input
                  id="technologies"
                  value={formData.technologies}
                  onChange={(e) => handleChange("technologies", e.target.value)}
                  placeholder="React, Node.js, AWS"
                />
              </div>
              <div>
                <Label htmlFor="numberOfRetailLocations">Number of Retail Locations</Label>
                <Input
                  id="numberOfRetailLocations"
                  value={formData.numberOfRetailLocations}
                  onChange={(e) => handleChange("numberOfRetailLocations", e.target.value)}
                  placeholder="10"
                />
              </div>
              <div>
                <Label htmlFor="annualRevenue">Annual Revenue</Label>
                <Input
                  id="annualRevenue"
                  value={formData.annualRevenue}
                  onChange={(e) => handleChange("annualRevenue", e.target.value)}
                  placeholder="$10M"
                />
              </div>
              <div>
                <Label htmlFor="totalFunding">Total Funding</Label>
                <Input
                  id="totalFunding"
                  value={formData.totalFunding}
                  onChange={(e) => handleChange("totalFunding", e.target.value)}
                  placeholder="$5M"
                />
              </div>
              <div>
                <Label htmlFor="latestFunding">Latest Funding</Label>
                <Input
                  id="latestFunding"
                  value={formData.latestFunding}
                  onChange={(e) => handleChange("latestFunding", e.target.value)}
                  placeholder="Series A"
                />
              </div>
              <div>
                <Label htmlFor="latestFundingAmount">Latest Funding Amount</Label>
                <Input
                  id="latestFundingAmount"
                  value={formData.latestFundingAmount}
                  onChange={(e) => handleChange("latestFundingAmount", e.target.value)}
                  placeholder="$2M"
                />
              </div>
              <div>
                <Label htmlFor="lastRaisedAt">Last Raised At</Label>
                <Input
                  id="lastRaisedAt"
                  value={formData.lastRaisedAt}
                  onChange={(e) => handleChange("lastRaisedAt", e.target.value)}
                  placeholder="2024-01-15"
                />
              </div>
              <div>
                <Label htmlFor="apolloContactId">Apollo Contact ID</Label>
                <Input
                  id="apolloContactId"
                  value={formData.apolloContactId}
                  onChange={(e) => handleChange("apolloContactId", e.target.value)}
                  placeholder="12345"
                />
              </div>
              <div>
                <Label htmlFor="apolloAccountId">Apollo Account ID</Label>
                <Input
                  id="apolloAccountId"
                  value={formData.apolloAccountId}
                  onChange={(e) => handleChange("apolloAccountId", e.target.value)}
                  placeholder="67890"
                />
              </div>
            </div>
          </div>

          {/* Secondary Email */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-4 text-foreground">Secondary Email</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="secondaryEmail">Secondary Email</Label>
                <Input
                  id="secondaryEmail"
                  type="email"
                  value={formData.secondaryEmail}
                  onChange={(e) => handleChange("secondaryEmail", e.target.value)}
                  placeholder="secondary@example.com"
                />
              </div>
              <div>
                <Label htmlFor="secondaryEmailSource">Source</Label>
                <Input
                  id="secondaryEmailSource"
                  value={formData.secondaryEmailSource}
                  onChange={(e) => handleChange("secondaryEmailSource", e.target.value)}
                  placeholder="LinkedIn"
                />
              </div>
              <div>
                <Label htmlFor="secondaryEmailStatus">Status</Label>
                <Input
                  id="secondaryEmailStatus"
                  value={formData.secondaryEmailStatus}
                  onChange={(e) => handleChange("secondaryEmailStatus", e.target.value)}
                  placeholder="Verified"
                />
              </div>
              <div>
                <Label htmlFor="secondaryEmailVerificationSource">Verification Source</Label>
                <Input
                  id="secondaryEmailVerificationSource"
                  value={formData.secondaryEmailVerificationSource}
                  onChange={(e) => handleChange("secondaryEmailVerificationSource", e.target.value)}
                  placeholder="Manual"
                />
              </div>
            </div>
          </div>

          {/* Tertiary Email */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-4 text-foreground">Tertiary Email</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tertiaryEmail">Tertiary Email</Label>
                <Input
                  id="tertiaryEmail"
                  type="email"
                  value={formData.tertiaryEmail}
                  onChange={(e) => handleChange("tertiaryEmail", e.target.value)}
                  placeholder="tertiary@example.com"
                />
              </div>
              <div>
                <Label htmlFor="tertiaryEmailSource">Source</Label>
                <Input
                  id="tertiaryEmailSource"
                  value={formData.tertiaryEmailSource}
                  onChange={(e) => handleChange("tertiaryEmailSource", e.target.value)}
                  placeholder="Website"
                />
              </div>
              <div>
                <Label htmlFor="tertiaryEmailStatus">Status</Label>
                <Input
                  id="tertiaryEmailStatus"
                  value={formData.tertiaryEmailStatus}
                  onChange={(e) => handleChange("tertiaryEmailStatus", e.target.value)}
                  placeholder="Pending"
                />
              </div>
              <div>
                <Label htmlFor="tertiaryEmailVerificationSource">Verification Source</Label>
                <Input
                  id="tertiaryEmailVerificationSource"
                  value={formData.tertiaryEmailVerificationSource}
                  onChange={(e) => handleChange("tertiaryEmailVerificationSource", e.target.value)}
                  placeholder="Auto"
                />
              </div>
            </div>
          </div>

          {/* Intent Information */}
          <div>
            <h3 className="text-base font-semibold mb-4 text-foreground">Intent Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="primaryIntentTopic">Primary Intent Topic</Label>
                <Input
                  id="primaryIntentTopic"
                  value={formData.primaryIntentTopic}
                  onChange={(e) => handleChange("primaryIntentTopic", e.target.value)}
                  placeholder="Product Demo"
                />
              </div>
              <div>
                <Label htmlFor="primaryIntentScore">Primary Intent Score</Label>
                <Input
                  id="primaryIntentScore"
                  value={formData.primaryIntentScore}
                  onChange={(e) => handleChange("primaryIntentScore", e.target.value)}
                  placeholder="85"
                />
              </div>
              <div>
                <Label htmlFor="secondaryIntentTopic">Secondary Intent Topic</Label>
                <Input
                  id="secondaryIntentTopic"
                  value={formData.secondaryIntentTopic}
                  onChange={(e) => handleChange("secondaryIntentTopic", e.target.value)}
                  placeholder="Pricing Info"
                />
              </div>
              <div>
                <Label htmlFor="secondaryIntentScore">Secondary Intent Score</Label>
                <Input
                  id="secondaryIntentScore"
                  value={formData.secondaryIntentScore}
                  onChange={(e) => handleChange("secondaryIntentScore", e.target.value)}
                  placeholder="65"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add Contact</Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

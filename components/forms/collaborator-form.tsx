'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { CheckCircle2 } from 'lucide-react';

interface CollaboratorFormData {
  fullName: string;
  email: string;
  phone: string;
  companyBrandName: string;
  countryCity: string;
  partnerType: string;
  websitePortfolio: string;
  size: string;
  collaborationTechnologyIntegration: boolean;
  collaborationContentDialog: boolean;
  collaborationMarketplaceParticipation: boolean;
  collaborationResearchContribution: boolean;
  collaborationStrategicPartnership: boolean;
  proposalDescription: string;
  valueYouBring: string;
  valueYouExpect: string;
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  companyBrandName?: string;
  countryCity?: string;
  partnerType?: string;
  size?: string;
  proposalDescription?: string;
  valueYouBring?: string;
  valueYouExpect?: string;
}

export default function CollaboratorForm() {
  const [formData, setFormData] = useState<CollaboratorFormData>({
    fullName: '',
    email: '',
    phone: '',
    companyBrandName: '',
    countryCity: '',
    partnerType: '',
    websitePortfolio: '',
    size: '',
    collaborationTechnologyIntegration: false,
    collaborationContentDialog: false,
    collaborationMarketplaceParticipation: false,
    collaborationResearchContribution: false,
    collaborationStrategicPartnership: false,
    proposalDescription: '',
    valueYouBring: '',
    valueYouExpect: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Required fields
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length > 100) {
      newErrors.fullName = 'Full name must be 100 characters or less';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        newErrors.phone = 'Phone number must contain at least 10 digits';
      } else if (formData.phone.length > 50) {
        newErrors.phone = 'Phone must be 50 characters or less';
      }
    }

    if (!formData.companyBrandName.trim()) {
      newErrors.companyBrandName = 'Company / Brand Name is required';
    } else if (formData.companyBrandName.length > 200) {
      newErrors.companyBrandName = 'Company / Brand Name must be 200 characters or less';
    }

    if (!formData.countryCity.trim()) {
      newErrors.countryCity = 'Country / City is required';
    } else if (formData.countryCity.length > 100) {
      newErrors.countryCity = 'Country / City must be 100 characters or less';
    }

    if (!formData.partnerType) {
      newErrors.partnerType = 'Partner type is required';
    }

    if (!formData.size) {
      newErrors.size = 'Size is required';
    }

    if (!formData.proposalDescription.trim()) {
      newErrors.proposalDescription = 'Proposal description is required';
    } else if (formData.proposalDescription.length > 500) {
      newErrors.proposalDescription = 'Proposal description must be 500 characters or less';
    }

    if (!formData.valueYouBring.trim()) {
      newErrors.valueYouBring = 'Value you bring is required';
    } else if (formData.valueYouBring.length > 500) {
      newErrors.valueYouBring = 'Value you bring must be 500 characters or less';
    }

    if (!formData.valueYouExpect.trim()) {
      newErrors.valueYouExpect = 'Value you expect is required';
    } else if (formData.valueYouExpect.length > 500) {
      newErrors.valueYouExpect = 'Value you expect must be 500 characters or less';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/collaborator-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setIsSubmitted(true);
        // Reset form
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          companyBrandName: '',
          countryCity: '',
          partnerType: '',
          websitePortfolio: '',
          size: '',
          collaborationTechnologyIntegration: false,
          collaborationContentDialog: false,
          collaborationMarketplaceParticipation: false,
          collaborationResearchContribution: false,
          collaborationStrategicPartnership: false,
          proposalDescription: '',
          valueYouBring: '',
          valueYouExpect: '',
        });
        setErrors({});

        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        alert('Failed to submit form. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="collaborator-tone">
      <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Left Column */}
        <div className="space-y-6 flex flex-col">
          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Contact Info</h3>

            <div>
              <Label htmlFor="fullName" className="text-white font-medium mb-2 block">
                Full Name *
              </Label>
              <Input
                id="fullName"
                type="text"
                value={formData.fullName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 100) {
                    setFormData({ ...formData, fullName: value });
                    if (errors.fullName) {
                      setErrors({ ...errors, fullName: undefined });
                    }
                  }
                }}
                placeholder="Enter your full name"
                className={`w-full bg-slate-800/50 text-white border-pink-400/30 ${
                  errors.fullName ? 'border-red-500' : ''
                }`}
                maxLength={100}
              />
              {errors.fullName && (
                <p className="text-red-400 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="text-white font-medium mb-2 block">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) {
                    setErrors({ ...errors, email: undefined });
                  }
                }}
                placeholder="your.email@example.com"
                className={`w-full bg-slate-800/50 text-white border-pink-400/30 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-white font-medium mb-2 block">
                Phone *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 50) {
                    setFormData({ ...formData, phone: value });
                    if (errors.phone) {
                      setErrors({ ...errors, phone: undefined });
                    }
                  }
                }}
                placeholder="+1 (555) 123-4567"
                className={`w-full bg-slate-800/50 text-white border-pink-400/30 ${
                  errors.phone ? 'border-red-500' : ''
                }`}
                maxLength={50}
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="companyBrandName" className="text-white font-medium mb-2 block">
                Company / Brand Name *
              </Label>
              <Input
                id="companyBrandName"
                type="text"
                value={formData.companyBrandName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    setFormData({ ...formData, companyBrandName: value });
                    if (errors.companyBrandName) {
                      setErrors({ ...errors, companyBrandName: undefined });
                    }
                  }
                }}
                placeholder="Enter your company or brand name"
                className={`w-full bg-slate-800/50 text-white border-pink-400/30 ${
                  errors.companyBrandName ? 'border-red-500' : ''
                }`}
                maxLength={200}
              />
              {errors.companyBrandName && (
                <p className="text-red-400 text-sm mt-1">{errors.companyBrandName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="countryCity" className="text-white font-medium mb-2 block">
                Country / City *
              </Label>
              <Input
                id="countryCity"
                type="text"
                value={formData.countryCity}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 100) {
                    setFormData({ ...formData, countryCity: value });
                    if (errors.countryCity) {
                      setErrors({ ...errors, countryCity: undefined });
                    }
                  }
                }}
                placeholder="e.g., New York, USA"
                className={`w-full bg-slate-800/50 text-white border-pink-400/30 ${
                  errors.countryCity ? 'border-red-500' : ''
                }`}
                maxLength={100}
              />
              {errors.countryCity && (
                <p className="text-red-400 text-sm mt-1">{errors.countryCity}</p>
              )}
            </div>
          </div>

          {/* Partner Profile Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Partner Profile</h3>

            <div>
              <Label htmlFor="partnerType" className="text-white font-medium mb-2 block">
                Type *
              </Label>
              <Select
                value={formData.partnerType}
                onValueChange={(value) => {
                  setFormData({ ...formData, partnerType: value });
                  if (errors.partnerType) {
                    setErrors({ ...errors, partnerType: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-pink-400/30 ${
                    errors.partnerType ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select partner type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Tech</SelectItem>
                  <SelectItem value="api">API</SelectItem>
                  <SelectItem value="media">Media</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="ngo">NGO</SelectItem>
                  <SelectItem value="corporate-brand">Corporate Brand</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="influencer">Influencer</SelectItem>
                </SelectContent>
              </Select>
              {errors.partnerType && (
                <p className="text-red-400 text-sm mt-1">{errors.partnerType}</p>
              )}
            </div>

            <div>
              <Label htmlFor="websitePortfolio" className="text-white font-medium mb-2 block">
                Website / Portfolio link
              </Label>
              <Input
                id="websitePortfolio"
                type="url"
                value={formData.websitePortfolio}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    setFormData({ ...formData, websitePortfolio: value });
                  }
                }}
                placeholder="https://example.com"
                className="w-full bg-slate-800/50 text-white border-pink-400/30"
                maxLength={500}
              />
            </div>

            <div>
              <Label htmlFor="size" className="text-white font-medium mb-2 block">
                Size *
              </Label>
              <Select
                value={formData.size}
                onValueChange={(value) => {
                  setFormData({ ...formData, size: value });
                  if (errors.size) {
                    setErrors({ ...errors, size: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-pink-400/30 ${
                    errors.size ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solo">Solo</SelectItem>
                  <SelectItem value="small-team">Small Team</SelectItem>
                  <SelectItem value="mid-size">Mid-size</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
              {errors.size && (
                <p className="text-red-400 text-sm mt-1">{errors.size}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 flex flex-col">
          {/* Collaboration Intent Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Collaboration Intent</h3>

            <div>
              <Label className="text-white font-medium mb-3 block">
                What kind of collaboration are you proposing
              </Label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="collaborationTechnologyIntegration"
                    checked={formData.collaborationTechnologyIntegration}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, collaborationTechnologyIntegration: checked === true })
                    }
                  />
                  <Label htmlFor="collaborationTechnologyIntegration" className="text-white font-normal cursor-pointer">
                    Technology Integration
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="collaborationContentDialog"
                    checked={formData.collaborationContentDialog}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, collaborationContentDialog: checked === true })
                    }
                  />
                  <Label htmlFor="collaborationContentDialog" className="text-white font-normal cursor-pointer">
                    Content & Dialog
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="collaborationMarketplaceParticipation"
                    checked={formData.collaborationMarketplaceParticipation}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, collaborationMarketplaceParticipation: checked === true })
                    }
                  />
                  <Label htmlFor="collaborationMarketplaceParticipation" className="text-white font-normal cursor-pointer">
                    Marketplace Participation
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="collaborationResearchContribution"
                    checked={formData.collaborationResearchContribution}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, collaborationResearchContribution: checked === true })
                    }
                  />
                  <Label htmlFor="collaborationResearchContribution" className="text-white font-normal cursor-pointer">
                    Research Contribution
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="collaborationStrategicPartnership"
                    checked={formData.collaborationStrategicPartnership}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, collaborationStrategicPartnership: checked === true })
                    }
                  />
                  <Label htmlFor="collaborationStrategicPartnership" className="text-white font-normal cursor-pointer">
                    Strategic Partnership
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="proposalDescription" className="text-white font-medium mb-2 block">
                Short description of your proposal *
              </Label>
              <Textarea
                id="proposalDescription"
                value={formData.proposalDescription}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    setFormData({ ...formData, proposalDescription: value });
                    if (errors.proposalDescription) {
                      setErrors({ ...errors, proposalDescription: undefined });
                    }
                  }
                }}
                placeholder="Describe your collaboration proposal..."
                className={`w-full bg-slate-800/50 text-white border-pink-400/30 min-h-[100px] ${
                  errors.proposalDescription ? 'border-red-500' : ''
                }`}
                maxLength={500}
              />
              <p className="text-gray-400 text-xs mt-1">
                {formData.proposalDescription.length}/500 characters
              </p>
              {errors.proposalDescription && (
                <p className="text-red-400 text-sm mt-1">{errors.proposalDescription}</p>
              )}
            </div>
          </div>

          {/* Value Exchange Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Value Exchange</h3>

            <div>
              <Label htmlFor="valueYouBring" className="text-white font-medium mb-2 block">
                What value do you bring to Zentrais *
              </Label>
              <Textarea
                id="valueYouBring"
                value={formData.valueYouBring}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    setFormData({ ...formData, valueYouBring: value });
                    if (errors.valueYouBring) {
                      setErrors({ ...errors, valueYouBring: undefined });
                    }
                  }
                }}
                placeholder="Describe the value you bring to Zentrais..."
                className={`w-full bg-slate-800/50 text-white border-pink-400/30 min-h-[100px] ${
                  errors.valueYouBring ? 'border-red-500' : ''
                }`}
                maxLength={500}
              />
              <p className="text-gray-400 text-xs mt-1">
                {formData.valueYouBring.length}/500 characters
              </p>
              {errors.valueYouBring && (
                <p className="text-red-400 text-sm mt-1">{errors.valueYouBring}</p>
              )}
            </div>

            <div>
              <Label htmlFor="valueYouExpect" className="text-white font-medium mb-2 block">
                What value do you expect from Zentrais *
              </Label>
              <Textarea
                id="valueYouExpect"
                value={formData.valueYouExpect}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    setFormData({ ...formData, valueYouExpect: value });
                    if (errors.valueYouExpect) {
                      setErrors({ ...errors, valueYouExpect: undefined });
                    }
                  }
                }}
                placeholder="Describe the value you expect from Zentrais..."
                className={`w-full bg-slate-800/50 text-white border-pink-400/30 min-h-[100px] ${
                  errors.valueYouExpect ? 'border-red-500' : ''
                }`}
                maxLength={500}
              />
              <p className="text-gray-400 text-xs mt-1">
                {formData.valueYouExpect.length}/500 characters
              </p>
              {errors.valueYouExpect && (
                <p className="text-red-400 text-sm mt-1">{errors.valueYouExpect}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center pt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`tone-button px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          } ${isSubmitted ? 'text-white' : 'text-white'}`}
        >
          {isSubmitted ? (
            <span className="flex items-center gap-2 text-white">
              <CheckCircle2 className="w-5 h-5" />
              Form Submitted Successfully!
            </span>
          ) : isSubmitting ? (
            'Submitting...'
          ) : (
            'Submit Collaboration Request'
          )}
        </button>
      </div>
    </form>
    </div>
  );
}


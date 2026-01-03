'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface InvestorFormData {
  fullName: string;
  email: string;
  phone: string;
  countryCity: string;
  organizationFundName: string;
  investorType: string;
  fundSize: string;
  typicalCheckSize: string;
  preferredSectors: string;
  whatCapturedInterest: string;
  componentsMatterMost: string;
  investmentTimeHorizon: string;
  materialsPitchDeck: boolean;
  materialsDataRoom: boolean;
  materialsTechnicalArchitecture: boolean;
  materialsCRIWhitepaper: boolean;
  materialsFinancialModel: boolean;
  wantMeetingWithFounders: string;
  questionsForFounders: string;
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  countryCity?: string;
  organizationFundName?: string;
  investorType?: string;
  fundSize?: string;
  typicalCheckSize?: string;
  preferredSectors?: string;
  whatCapturedInterest?: string;
  componentsMatterMost?: string;
  investmentTimeHorizon?: string;
  wantMeetingWithFounders?: string;
  questionsForFounders?: string;
}

export default function InvestorForm() {
  const [formData, setFormData] = useState<InvestorFormData>({
    fullName: '',
    email: '',
    phone: '',
    countryCity: '',
    organizationFundName: '',
    investorType: '',
    fundSize: '',
    typicalCheckSize: '',
    preferredSectors: '',
    whatCapturedInterest: '',
    componentsMatterMost: '',
    investmentTimeHorizon: '',
    materialsPitchDeck: false,
    materialsDataRoom: false,
    materialsTechnicalArchitecture: false,
    materialsCRIWhitepaper: false,
    materialsFinancialModel: false,
    wantMeetingWithFounders: '',
    questionsForFounders: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Email validation regex
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate text length (max chars)
  const validateTextLength = (text: string, maxLength: number): boolean => {
    return text.length <= maxLength;
  };

  // Validate required fields
  const validateForm = (): { isValid: boolean; errors: ValidationErrors } => {
    const newErrors: ValidationErrors = {};

    // Required field validations
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.length > 100) {
      newErrors.fullName = 'Full name must be less than 100 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else {
      const digitsOnly = formData.phone.replace(/\D/g, '');
      if (digitsOnly.length < 10) {
        newErrors.phone = 'Phone number must contain at least 10 digits';
      } else if (!validateTextLength(formData.phone, 50)) {
        newErrors.phone = 'Phone must be less than 50 characters';
      }
    }

    if (!formData.countryCity.trim()) {
      newErrors.countryCity = 'Country/City is required';
    } else if (!validateTextLength(formData.countryCity, 100)) {
      newErrors.countryCity = 'Country/City must be less than 100 characters';
    }

    if (!formData.organizationFundName.trim()) {
      newErrors.organizationFundName = 'Organization/Fund name is required';
    } else if (!validateTextLength(formData.organizationFundName, 200)) {
      newErrors.organizationFundName = 'Organization/Fund name must be less than 200 characters';
    }

    if (!formData.investorType) {
      newErrors.investorType = 'Investor type is required';
    }

    if (!formData.fundSize.trim()) {
      newErrors.fundSize = 'Fund size or investment capacity is required';
    } else if (!validateTextLength(formData.fundSize, 200)) {
      newErrors.fundSize = 'Fund size must be less than 200 characters';
    }

    if (!formData.typicalCheckSize.trim()) {
      newErrors.typicalCheckSize = 'Typical check size is required';
    } else if (!validateTextLength(formData.typicalCheckSize, 200)) {
      newErrors.typicalCheckSize = 'Typical check size must be less than 200 characters';
    }

    if (!formData.preferredSectors.trim()) {
      newErrors.preferredSectors = 'Preferred sectors or thesis focus is required';
    } else if (!validateTextLength(formData.preferredSectors, 500)) {
      newErrors.preferredSectors = 'Preferred sectors must be less than 500 characters';
    }

    if (!formData.whatCapturedInterest.trim()) {
      newErrors.whatCapturedInterest = 'This field is required';
    } else if (!validateTextLength(formData.whatCapturedInterest, 500)) {
      newErrors.whatCapturedInterest = 'Text must be less than 500 characters';
    }

    if (!formData.componentsMatterMost) {
      newErrors.componentsMatterMost = 'Please select at least one component';
    }

    if (!formData.investmentTimeHorizon) {
      newErrors.investmentTimeHorizon = 'Investment time horizon is required';
    }

    if (!formData.wantMeetingWithFounders) {
      newErrors.wantMeetingWithFounders = 'Please indicate if you want a meeting with Founders';
    }

    // Optional field validations
    if (formData.questionsForFounders && !validateTextLength(formData.questionsForFounders, 1000)) {
      newErrors.questionsForFounders = 'Text must be less than 1000 characters';
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form and show errors if any
    const validation = validateForm();
    if (!validation.isValid) {
      // Scroll to first error after a brief delay to ensure errors are rendered
      setTimeout(() => {
        const firstErrorKey = Object.keys(validation.errors)[0];
        if (firstErrorKey) {
          const element = document.getElementById(firstErrorKey);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.focus();
          }
        }
      }, 100);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/investor-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        setIsSubmitted(true);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          countryCity: '',
          organizationFundName: '',
          investorType: '',
          fundSize: '',
          typicalCheckSize: '',
          preferredSectors: '',
          whatCapturedInterest: '',
          componentsMatterMost: '',
          investmentTimeHorizon: '',
          materialsPitchDeck: false,
          materialsDataRoom: false,
          materialsTechnicalArchitecture: false,
          materialsCRIWhitepaper: false,
          materialsFinancialModel: false,
          wantMeetingWithFounders: '',
          questionsForFounders: '',
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
    <div className="investors-tone">
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
                className={`w-full bg-slate-800/50 text-white border-indigo-400/30 ${
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
                className={`w-full bg-slate-800/50 text-white border-indigo-400/30 ${
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
                className={`w-full bg-slate-800/50 text-white border-indigo-400/30 ${
                  errors.phone ? 'border-red-500' : ''
                }`}
                maxLength={50}
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="countryCity" className="text-white font-medium mb-2 block">
                Country/City *
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
                className={`w-full bg-slate-800/50 text-white border-indigo-400/30 ${
                  errors.countryCity ? 'border-red-500' : ''
                }`}
                maxLength={100}
              />
              {errors.countryCity && (
                <p className="text-red-400 text-sm mt-1">{errors.countryCity}</p>
              )}
            </div>

            <div>
              <Label htmlFor="organizationFundName" className="text-white font-medium mb-2 block">
                Organization / Fund Name *
              </Label>
              <Input
                id="organizationFundName"
                type="text"
                value={formData.organizationFundName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    setFormData({ ...formData, organizationFundName: value });
                    if (errors.organizationFundName) {
                      setErrors({ ...errors, organizationFundName: undefined });
                    }
                  }
                }}
                placeholder="Enter your organization or fund name"
                className={`w-full bg-slate-800/50 text-white border-indigo-400/30 ${
                  errors.organizationFundName ? 'border-red-500' : ''
                }`}
                maxLength={200}
              />
              {errors.organizationFundName && (
                <p className="text-red-400 text-sm mt-1">{errors.organizationFundName}</p>
              )}
            </div>
          </div>

          {/* Investor Profile Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Investor Profile</h3>

            <div>
              <Label htmlFor="investorType" className="text-white font-medium mb-2 block">
                Type *
              </Label>
              <Select
                value={formData.investorType}
                onValueChange={(value) => {
                  setFormData({ ...formData, investorType: value });
                  if (errors.investorType) {
                    setErrors({ ...errors, investorType: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-indigo-400/30 ${
                    errors.investorType ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select investor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="angel">Angel</SelectItem>
                  <SelectItem value="vc">VC</SelectItem>
                  <SelectItem value="family-office">Family Office</SelectItem>
                  <SelectItem value="strategic-investor">Strategic Investor</SelectItem>
                </SelectContent>
              </Select>
              {errors.investorType && (
                <p className="text-red-400 text-sm mt-1">{errors.investorType}</p>
              )}
            </div>

            <div>
              <Label htmlFor="fundSize" className="text-white font-medium mb-2 block">
                Fund Size or Investment Capacity *
              </Label>
              <Input
                id="fundSize"
                type="text"
                value={formData.fundSize}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    setFormData({ ...formData, fundSize: value });
                    if (errors.fundSize) {
                      setErrors({ ...errors, fundSize: undefined });
                    }
                  }
                }}
                placeholder="e.g., $10M - $50M"
                className={`w-full bg-slate-800/50 text-white border-indigo-400/30 ${
                  errors.fundSize ? 'border-red-500' : ''
                }`}
                maxLength={200}
              />
              {errors.fundSize && (
                <p className="text-red-400 text-sm mt-1">{errors.fundSize}</p>
              )}
            </div>

            <div>
              <Label htmlFor="typicalCheckSize" className="text-white font-medium mb-2 block">
                Typical Check Size *
              </Label>
              <Input
                id="typicalCheckSize"
                type="text"
                value={formData.typicalCheckSize}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    setFormData({ ...formData, typicalCheckSize: value });
                    if (errors.typicalCheckSize) {
                      setErrors({ ...errors, typicalCheckSize: undefined });
                    }
                  }
                }}
                placeholder="e.g., $100K - $500K"
                className={`w-full bg-slate-800/50 text-white border-indigo-400/30 ${
                  errors.typicalCheckSize ? 'border-red-500' : ''
                }`}
                maxLength={200}
              />
              {errors.typicalCheckSize && (
                <p className="text-red-400 text-sm mt-1">{errors.typicalCheckSize}</p>
              )}
            </div>

            <div>
              <Label htmlFor="preferredSectors" className="text-white font-medium mb-2 block">
                Preferred Sectors or Thesis Focus *
              </Label>
              <Textarea
                id="preferredSectors"
                value={formData.preferredSectors}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    setFormData({ ...formData, preferredSectors: value });
                    if (errors.preferredSectors) {
                      setErrors({ ...errors, preferredSectors: undefined });
                    }
                  }
                }}
                placeholder="Describe your preferred sectors or investment thesis..."
                className={`w-full bg-slate-800/50 text-white border-indigo-400/30 min-h-[100px] ${
                  errors.preferredSectors ? 'border-red-500' : ''
                }`}
                maxLength={500}
              />
              <p className="text-gray-400 text-xs mt-1">
                {formData.preferredSectors.length}/500 characters
              </p>
              {errors.preferredSectors && (
                <p className="text-red-400 text-sm mt-1">{errors.preferredSectors}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 flex flex-col">
          {/* Interest in Zentrais Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Interest in Zentrais</h3>

            <div>
              <Label htmlFor="whatCapturedInterest" className="text-white font-medium mb-2 block">
                What about Zentrais captured your interest *
              </Label>
              <Textarea
                id="whatCapturedInterest"
                value={formData.whatCapturedInterest}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    setFormData({ ...formData, whatCapturedInterest: value });
                    if (errors.whatCapturedInterest) {
                      setErrors({ ...errors, whatCapturedInterest: undefined });
                    }
                  }
                }}
                placeholder="Tell us what captured your interest in Zentrais..."
                className={`w-full bg-slate-800/50 text-white border-indigo-400/30 min-h-[100px] ${
                  errors.whatCapturedInterest ? 'border-red-500' : ''
                }`}
                maxLength={500}
              />
              <p className="text-gray-400 text-xs mt-1">
                {formData.whatCapturedInterest.length}/500 characters
              </p>
              {errors.whatCapturedInterest && (
                <p className="text-red-400 text-sm mt-1">{errors.whatCapturedInterest}</p>
              )}
            </div>

            <div>
              <Label htmlFor="componentsMatterMost" className="text-white font-medium mb-2 block">
                Which components matter most *
              </Label>
              <Select
                value={formData.componentsMatterMost}
                onValueChange={(value) => {
                  setFormData({ ...formData, componentsMatterMost: value });
                  if (errors.componentsMatterMost) {
                    setErrors({ ...errors, componentsMatterMost: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-indigo-400/30 ${
                    errors.componentsMatterMost ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select a component" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cri">CRI</SelectItem>
                  <SelectItem value="integrity-engine">Integrity Engine</SelectItem>
                  <SelectItem value="human-ai-collaboration">Human-AI Collaboration</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                </SelectContent>
              </Select>
              {errors.componentsMatterMost && (
                <p className="text-red-400 text-sm mt-1">{errors.componentsMatterMost}</p>
              )}
            </div>

            <div>
              <Label htmlFor="investmentTimeHorizon" className="text-white font-medium mb-2 block">
                Investment Time Horizon *
              </Label>
              <Select
                value={formData.investmentTimeHorizon}
                onValueChange={(value) => {
                  setFormData({ ...formData, investmentTimeHorizon: value });
                  if (errors.investmentTimeHorizon) {
                    setErrors({ ...errors, investmentTimeHorizon: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-indigo-400/30 ${
                    errors.investmentTimeHorizon ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select time horizon" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-6mo">0-6 months</SelectItem>
                  <SelectItem value="6-12mo">6-12 months</SelectItem>
                  <SelectItem value="12+mo">12+ months</SelectItem>
                </SelectContent>
              </Select>
              {errors.investmentTimeHorizon && (
                <p className="text-red-400 text-sm mt-1">{errors.investmentTimeHorizon}</p>
              )}
            </div>
          </div>

          {/* Due Diligence Needs Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Due Diligence Needs</h3>

            <div>
              <Label className="text-white font-medium mb-3 block">
                What materials do you want access to
              </Label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="materialsPitchDeck"
                    checked={formData.materialsPitchDeck}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, materialsPitchDeck: checked === true })
                    }
                  />
                  <Label htmlFor="materialsPitchDeck" className="text-white font-normal cursor-pointer">
                    Pitch Deck
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="materialsDataRoom"
                    checked={formData.materialsDataRoom}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, materialsDataRoom: checked === true })
                    }
                  />
                  <Label htmlFor="materialsDataRoom" className="text-white font-normal cursor-pointer">
                    Data Room
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="materialsTechnicalArchitecture"
                    checked={formData.materialsTechnicalArchitecture}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, materialsTechnicalArchitecture: checked === true })
                    }
                  />
                  <Label htmlFor="materialsTechnicalArchitecture" className="text-white font-normal cursor-pointer">
                    Technical Architecture
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="materialsCRIWhitepaper"
                    checked={formData.materialsCRIWhitepaper}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, materialsCRIWhitepaper: checked === true })
                    }
                  />
                  <Label htmlFor="materialsCRIWhitepaper" className="text-white font-normal cursor-pointer">
                    CRI Whitepaper
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="materialsFinancialModel"
                    checked={formData.materialsFinancialModel}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, materialsFinancialModel: checked === true })
                    }
                  />
                  <Label htmlFor="materialsFinancialModel" className="text-white font-normal cursor-pointer">
                    Financial Model
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="wantMeetingWithFounders" className="text-white font-medium mb-2 block">
                Do you want a meeting with Founders *
              </Label>
              <Select
                value={formData.wantMeetingWithFounders}
                onValueChange={(value) => {
                  setFormData({ ...formData, wantMeetingWithFounders: value });
                  if (errors.wantMeetingWithFounders) {
                    setErrors({ ...errors, wantMeetingWithFounders: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-indigo-400/30 ${
                    errors.wantMeetingWithFounders ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              {errors.wantMeetingWithFounders && (
                <p className="text-red-400 text-sm mt-1">{errors.wantMeetingWithFounders}</p>
              )}
            </div>

            {/* Questions / Notes Section */}
            <div className="space-y-4 border-t border-indigo-400/20 pt-6">
              <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Questions / Notes</h3>

              <div>
                <Label htmlFor="questionsForFounders" className="text-white font-medium mb-2 block">
                  Any questions for the Founders
                </Label>
                <Textarea
                  id="questionsForFounders"
                  value={formData.questionsForFounders}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value.length <= 1000) {
                      setFormData({ ...formData, questionsForFounders: value });
                      if (errors.questionsForFounders) {
                        setErrors({ ...errors, questionsForFounders: undefined });
                      }
                    }
                  }}
                  placeholder="Ask any questions you have for the Founders..."
                  className={`w-full bg-slate-800/50 text-white border-indigo-400/30 min-h-[120px] ${
                    errors.questionsForFounders ? 'border-red-500' : ''
                  }`}
                  maxLength={1000}
                />
                <p className="text-gray-400 text-xs mt-1">
                  {formData.questionsForFounders.length}/1000 characters
                </p>
                {errors.questionsForFounders && (
                  <p className="text-red-400 text-sm mt-1">{errors.questionsForFounders}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button at Bottom */}
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitted || isSubmitting}
          className={`tone-button w-full text-white font-bold py-4 px-6 rounded-lg transition-all duration-500 text-lg sm:text-xl font-sans relative overflow-hidden ${
            isSubmitted || isSubmitting
              ? 'scale-75 opacity-75 cursor-not-allowed'
              : 'hover:scale-105'
          }`}
        >
          <span
            className={`flex items-center justify-center gap-2 transition-all duration-500 ${
              isSubmitted || isSubmitting ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </span>
          <span
            className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
              isSubmitted ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
            }`}
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="ml-2 text-white">Thank you! We'll be in touch soon.</span>
          </span>
        </button>
      </div>
    </form>
    </div>
  );
}


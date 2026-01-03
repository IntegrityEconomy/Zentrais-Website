'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

interface BetaUserFormData {
  fullName: string;
  email: string;
  countryCity: string;
  preferredLanguage: string;
  ageRange: string;
  occupation: string;
  aiFamiliarity: string;
  whatBroughtYou: string;
  engineInterest: string;
  problemToSolve: string;
  betaExpectations: string;
  featureToTest: string;
  whatsMissing: string;
  blockers: string;
  additionalComments: string;
  consent: boolean;
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  countryCity?: string;
  preferredLanguage?: string;
  ageRange?: string;
  occupation?: string;
  aiFamiliarity?: string;
  engineInterest?: string;
  consent?: string;
  whatBroughtYou?: string;
  problemToSolve?: string;
  betaExpectations?: string;
  featureToTest?: string;
  whatsMissing?: string;
  blockers?: string;
  additionalComments?: string;
}

export default function BetaUserForm() {
  const [formData, setFormData] = useState<BetaUserFormData>({
    fullName: '',
    email: '',
    countryCity: '',
    preferredLanguage: '',
    ageRange: '',
    occupation: '',
    aiFamiliarity: '',
    whatBroughtYou: '',
    engineInterest: '',
    problemToSolve: '',
    betaExpectations: '',
    featureToTest: '',
    whatsMissing: '',
    blockers: '',
    additionalComments: '',
    consent: false,
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
    } else if (formData.fullName.length > 50) {
      newErrors.fullName = 'Full name must be less than 50 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.countryCity.trim()) {
      newErrors.countryCity = 'Country/City is required';
    } else if (!validateTextLength(formData.countryCity, 100)) {
      newErrors.countryCity = 'Country/City must be less than 100 characters';
    }

    if (!formData.preferredLanguage) {
      newErrors.preferredLanguage = 'Preferred language is required';
    }

    if (!formData.ageRange) {
      newErrors.ageRange = 'Age range is required';
    }

    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Occupation is required';
    } else if (!validateTextLength(formData.occupation, 100)) {
      newErrors.occupation = 'Occupation must be less than 100 characters';
    }

    if (!formData.aiFamiliarity) {
      newErrors.aiFamiliarity = 'AI familiarity level is required';
    }

    if (!formData.engineInterest) {
      newErrors.engineInterest = 'Engine interest is required';
    }

    if (!formData.consent) {
      newErrors.consent = 'You must agree to receive Beta updates';
    }

    // Optional field validations (max length checks to prevent spam)
    if (formData.whatBroughtYou && !validateTextLength(formData.whatBroughtYou, 500)) {
      newErrors.whatBroughtYou = 'Text must be less than 500 characters';
    }

    if (formData.problemToSolve && !validateTextLength(formData.problemToSolve, 500)) {
      newErrors.problemToSolve = 'Text must be less than 500 characters';
    }

    if (formData.betaExpectations && !validateTextLength(formData.betaExpectations, 500)) {
      newErrors.betaExpectations = 'Text must be less than 500 characters';
    }

    if (formData.featureToTest && !validateTextLength(formData.featureToTest, 200)) {
      newErrors.featureToTest = 'Text must be less than 200 characters';
    }

    if (formData.whatsMissing && !validateTextLength(formData.whatsMissing, 500)) {
      newErrors.whatsMissing = 'Text must be less than 500 characters';
    }

    if (formData.blockers && !validateTextLength(formData.blockers, 500)) {
      newErrors.blockers = 'Text must be less than 500 characters';
    }

    if (formData.additionalComments && !validateTextLength(formData.additionalComments, 1000)) {
      newErrors.additionalComments = 'Text must be less than 1000 characters';
    }

    setErrors(newErrors);
    return { isValid: Object.keys(newErrors).length === 0, errors: newErrors };
  };

  // Check if form is valid (for button enable/disable)
  const isFormValid = (): boolean => {
    return (
      formData.fullName.trim().length > 0 &&
      formData.fullName.length <= 50 &&
      formData.email.trim().length > 0 &&
      validateEmail(formData.email) &&
      formData.countryCity.trim().length > 0 &&
      formData.countryCity.length <= 100 &&
      formData.preferredLanguage.length > 0 &&
      formData.ageRange.length > 0 &&
      formData.occupation.trim().length > 0 &&
      formData.occupation.length <= 100 &&
      formData.aiFamiliarity.length > 0 &&
      formData.engineInterest.length > 0 &&
      formData.consent &&
      (!formData.whatBroughtYou || formData.whatBroughtYou.length <= 500) &&
      (!formData.problemToSolve || formData.problemToSolve.length <= 500) &&
      (!formData.betaExpectations || formData.betaExpectations.length <= 500) &&
      (!formData.featureToTest || formData.featureToTest.length <= 200) &&
      (!formData.whatsMissing || formData.whatsMissing.length <= 500) &&
      (!formData.blockers || formData.blockers.length <= 500) &&
      (!formData.additionalComments || formData.additionalComments.length <= 1000)
    );
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
      const response = await fetch('/api/beta-signup', {
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
          countryCity: '',
          preferredLanguage: '',
          ageRange: '',
          occupation: '',
          aiFamiliarity: '',
          whatBroughtYou: '',
          engineInterest: '',
          problemToSolve: '',
          betaExpectations: '',
          featureToTest: '',
          whatsMissing: '',
          blockers: '',
          additionalComments: '',
          consent: false,
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column */}
        <div className="space-y-6">
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
                  if (value.length <= 50) {
                    setFormData({ ...formData, fullName: value });
                    if (errors.fullName) {
                      setErrors({ ...errors, fullName: undefined });
                    }
                  }
                }}
                placeholder="Enter your full name (max 50 characters)"
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                  errors.fullName ? 'border-red-500' : ''
                }`}
                maxLength={50}
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
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
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
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                  errors.countryCity ? 'border-red-500' : ''
                }`}
                maxLength={100}
              />
              {errors.countryCity && (
                <p className="text-red-400 text-sm mt-1">{errors.countryCity}</p>
              )}
            </div>

            <div>
              <Label htmlFor="preferredLanguage" className="text-white font-medium mb-2 block">
                Preferred Language *
              </Label>
              <Select
                value={formData.preferredLanguage}
                onValueChange={(value) => {
                  setFormData({ ...formData, preferredLanguage: value });
                  if (errors.preferredLanguage) {
                    setErrors({ ...errors, preferredLanguage: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                    errors.preferredLanguage ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select your preferred language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="german">German</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.preferredLanguage && (
                <p className="text-red-400 text-sm mt-1">{errors.preferredLanguage}</p>
              )}
            </div>
          </div>

          {/* User Profile Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">User Profile</h3>

            <div>
              <Label htmlFor="ageRange" className="text-white font-medium mb-2 block">
                Age Range *
              </Label>
              <Select
                value={formData.ageRange}
                onValueChange={(value) => {
                  setFormData({ ...formData, ageRange: value });
                  if (errors.ageRange) {
                    setErrors({ ...errors, ageRange: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                    errors.ageRange ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select your age range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18-24">18-24</SelectItem>
                  <SelectItem value="25-34">25-34</SelectItem>
                  <SelectItem value="35-44">35-44</SelectItem>
                  <SelectItem value="45-54">45-54</SelectItem>
                  <SelectItem value="55-64">55-64</SelectItem>
                  <SelectItem value="65+">65+</SelectItem>
                </SelectContent>
              </Select>
              {errors.ageRange && (
                <p className="text-red-400 text-sm mt-1">{errors.ageRange}</p>
              )}
            </div>

            <div>
              <Label htmlFor="occupation" className="text-white font-medium mb-2 block">
                Occupation *
              </Label>
              <Input
                id="occupation"
                type="text"
                value={formData.occupation}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 100) {
                    setFormData({ ...formData, occupation: value });
                    if (errors.occupation) {
                      setErrors({ ...errors, occupation: undefined });
                    }
                  }
                }}
                placeholder="e.g., Software Engineer, Student, Designer"
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                  errors.occupation ? 'border-red-500' : ''
                }`}
                maxLength={100}
              />
              {errors.occupation && (
                <p className="text-red-400 text-sm mt-1">{errors.occupation}</p>
              )}
            </div>

            <div>
              <Label htmlFor="aiFamiliarity" className="text-white font-medium mb-2 block">
                How familiar are you with AI platforms? *
              </Label>
              <Select
                value={formData.aiFamiliarity}
                onValueChange={(value) => {
                  setFormData({ ...formData, aiFamiliarity: value });
                  if (errors.aiFamiliarity) {
                    setErrors({ ...errors, aiFamiliarity: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                    errors.aiFamiliarity ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select your familiarity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              {errors.aiFamiliarity && (
                <p className="text-red-400 text-sm mt-1">{errors.aiFamiliarity}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Interest in Zentrais Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Interest in Zentrais</h3>

            <div>
              <Label htmlFor="whatBroughtYou" className="text-white font-medium mb-2 block">
                What brought you here today?
              </Label>
              <Textarea
                id="whatBroughtYou"
                value={formData.whatBroughtYou}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    setFormData({ ...formData, whatBroughtYou: value });
                    if (errors.whatBroughtYou) {
                      setErrors({ ...errors, whatBroughtYou: undefined });
                    }
                  }
                }}
                placeholder="Tell us what led you to Zentrais... (max 500 characters)"
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 min-h-[100px] ${
                  errors.whatBroughtYou ? 'border-red-500' : ''
                }`}
                maxLength={500}
              />
              <p className="text-gray-400 text-xs mt-1">
                {formData.whatBroughtYou.length}/500 characters
              </p>
              {errors.whatBroughtYou && (
                <p className="text-red-400 text-sm mt-1">{errors.whatBroughtYou}</p>
              )}
            </div>

            <div>
              <Label htmlFor="engineInterest" className="text-white font-medium mb-2 block">
                Which engine interests you most? *
              </Label>
              <Select
                value={formData.engineInterest}
                onValueChange={(value) => {
                  setFormData({ ...formData, engineInterest: value });
                  if (errors.engineInterest) {
                    setErrors({ ...errors, engineInterest: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                    errors.engineInterest ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select an engine" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="perspective">Perspective</SelectItem>
                  <SelectItem value="dialog">Dialog</SelectItem>
                  <SelectItem value="exchange">Exchange</SelectItem>
                </SelectContent>
              </Select>
              {errors.engineInterest && (
                <p className="text-red-400 text-sm mt-1">{errors.engineInterest}</p>
              )}
            </div>

            <div>
              <Label htmlFor="problemToSolve" className="text-white font-medium mb-2 block">
                What problem do you hope Zentrais solves for you?
              </Label>
              <Textarea
                id="problemToSolve"
                value={formData.problemToSolve}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    setFormData({ ...formData, problemToSolve: value });
                    if (errors.problemToSolve) {
                      setErrors({ ...errors, problemToSolve: undefined });
                    }
                  }
                }}
                placeholder="Describe the problem or challenge you're facing... (max 500 characters)"
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 min-h-[100px] ${
                  errors.problemToSolve ? 'border-red-500' : ''
                }`}
                maxLength={500}
              />
              <p className="text-gray-400 text-xs mt-1">
                {formData.problemToSolve.length}/500 characters
              </p>
              {errors.problemToSolve && (
                <p className="text-red-400 text-sm mt-1">{errors.problemToSolve}</p>
              )}
            </div>
          </div>

          {/* Experience Expectations Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Experience Expectations</h3>

            <div>
              <Label htmlFor="betaExpectations" className="text-white font-medium mb-2 block">
                What do you expect from the Beta?
              </Label>
              <Textarea
                id="betaExpectations"
                value={formData.betaExpectations}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    setFormData({ ...formData, betaExpectations: value });
                    if (errors.betaExpectations) {
                      setErrors({ ...errors, betaExpectations: undefined });
                    }
                  }
                }}
                placeholder="Share your expectations for the Beta program... (max 500 characters)"
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 min-h-[100px] ${
                  errors.betaExpectations ? 'border-red-500' : ''
                }`}
                maxLength={500}
              />
              <p className="text-gray-400 text-xs mt-1">
                {formData.betaExpectations.length}/500 characters
              </p>
              {errors.betaExpectations && (
                <p className="text-red-400 text-sm mt-1">{errors.betaExpectations}</p>
              )}
            </div>

            <div>
              <Label htmlFor="featureToTest" className="text-white font-medium mb-2 block">
                What feature do you want to test first?
              </Label>
              <Input
                id="featureToTest"
                type="text"
                value={formData.featureToTest}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    setFormData({ ...formData, featureToTest: value });
                    if (errors.featureToTest) {
                      setErrors({ ...errors, featureToTest: undefined });
                    }
                  }
                }}
                placeholder="e.g., Perspective engine, Dialog chat, Exchange marketplace"
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                  errors.featureToTest ? 'border-red-500' : ''
                }`}
                maxLength={200}
              />
              <p className="text-gray-400 text-xs mt-1">
                {formData.featureToTest.length}/200 characters
              </p>
              {errors.featureToTest && (
                <p className="text-red-400 text-sm mt-1">{errors.featureToTest}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feedback / Questions Section - Full Width */}
      <div className="space-y-4 border-t border-blue-400/20 pt-6">
        <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Feedback / Questions</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <Label htmlFor="whatsMissing" className="text-white font-medium mb-2 block">
              What's missing or unclear on the website?
            </Label>
            <Textarea
              id="whatsMissing"
              value={formData.whatsMissing}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 500) {
                  setFormData({ ...formData, whatsMissing: value });
                  if (errors.whatsMissing) {
                    setErrors({ ...errors, whatsMissing: undefined });
                  }
                }
              }}
              placeholder="Help us improve our website... (max 500 characters)"
              className={`w-full bg-slate-800/50 text-white border-blue-400/30 min-h-[100px] ${
                errors.whatsMissing ? 'border-red-500' : ''
              }`}
              maxLength={500}
            />
            <p className="text-gray-400 text-xs mt-1">
              {formData.whatsMissing.length}/500 characters
            </p>
            {errors.whatsMissing && (
              <p className="text-red-400 text-sm mt-1">{errors.whatsMissing}</p>
            )}
          </div>

          <div>
            <Label htmlFor="blockers" className="text-white font-medium mb-2 block">
              Any blockers that would prevent you from joining Beta?
            </Label>
            <Textarea
              id="blockers"
              value={formData.blockers}
              onChange={(e) => {
                const value = e.target.value;
                if (value.length <= 500) {
                  setFormData({ ...formData, blockers: value });
                  if (errors.blockers) {
                    setErrors({ ...errors, blockers: undefined });
                  }
                }
              }}
              placeholder="Let us know about any concerns or obstacles... (max 500 characters)"
              className={`w-full bg-slate-800/50 text-white border-blue-400/30 min-h-[100px] ${
                errors.blockers ? 'border-red-500' : ''
              }`}
              maxLength={500}
            />
            <p className="text-gray-400 text-xs mt-1">
              {formData.blockers.length}/500 characters
            </p>
            {errors.blockers && (
              <p className="text-red-400 text-sm mt-1">{errors.blockers}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="additionalComments" className="text-white font-medium mb-2 block">
            Any additional comments or questions?
          </Label>
          <Textarea
            id="additionalComments"
            value={formData.additionalComments}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= 1000) {
                setFormData({ ...formData, additionalComments: value });
                if (errors.additionalComments) {
                  setErrors({ ...errors, additionalComments: undefined });
                }
              }
            }}
            placeholder="Anything else you'd like to share... (max 1000 characters)"
            className={`w-full bg-slate-800/50 text-white border-blue-400/30 min-h-[120px] ${
              errors.additionalComments ? 'border-red-500' : ''
            }`}
            maxLength={1000}
          />
          <p className="text-gray-400 text-xs mt-1">
            {formData.additionalComments.length}/1000 characters
          </p>
          {errors.additionalComments && (
            <p className="text-red-400 text-sm mt-1">{errors.additionalComments}</p>
          )}
        </div>
      </div>

      {/* Consent Section */}
      <div className="flex items-start gap-3 border-t border-blue-400/20 pt-6">
        <Checkbox
          id="consent"
          checked={formData.consent}
          onCheckedChange={(checked) => {
            setFormData({ ...formData, consent: checked === true });
            if (errors.consent) {
              setErrors({ ...errors, consent: undefined });
            }
          }}
          className="mt-1"
        />
        <Label htmlFor="consent" className="text-white font-medium cursor-pointer">
          I agree to receive Beta updates and onboarding information. *
        </Label>
      </div>
      {errors.consent && (
        <p className="text-red-400 text-sm -mt-4">{errors.consent}</p>
      )}

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
            {isSubmitting ? 'Submitting...' : 'Sign Up for Beta'}
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
  );
}


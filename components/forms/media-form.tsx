'use client';

import { useState } from 'react';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import { CheckCircle2 } from 'lucide-react';

interface MediaFormData {
  fullName: string;
  email: string;
  phone: string;
  mediaType: string;
  organizationChannelHandle: string;
  storyExploring: string;
  theme: string;
  interviewRequest: string;
  assetsPressKit: boolean;
  assetsLogosBrandAssets: boolean;
  assetsFounderBioPack: boolean;
  assetsProductCaptures: boolean;
  assetsResearchData: boolean;
  accessToTeam: string;
  preferredTimeline: string;
  specificQuestions: string;
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  mediaType?: string;
  organizationChannelHandle?: string;
  storyExploring?: string;
  theme?: string;
  interviewRequest?: string;
  accessToTeam?: string;
  preferredTimeline?: string;
  specificQuestions?: string;
}

export default function MediaForm() {
  const [formData, setFormData] = useState<MediaFormData>({
    fullName: '',
    email: '',
    phone: '',
    mediaType: '',
    organizationChannelHandle: '',
    storyExploring: '',
    theme: '',
    interviewRequest: '',
    assetsPressKit: false,
    assetsLogosBrandAssets: false,
    assetsFounderBioPack: false,
    assetsProductCaptures: false,
    assetsResearchData: false,
    accessToTeam: '',
    preferredTimeline: '',
    specificQuestions: '',
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

    if (!formData.mediaType) {
      newErrors.mediaType = 'Media type is required';
    }

    if (!formData.organizationChannelHandle.trim()) {
      newErrors.organizationChannelHandle = 'Organization / Channel / Handle is required';
    } else if (formData.organizationChannelHandle.length > 200) {
      newErrors.organizationChannelHandle = 'Organization / Channel / Handle must be 200 characters or less';
    }

    if (!formData.storyExploring.trim()) {
      newErrors.storyExploring = 'Story exploring is required';
    } else if (formData.storyExploring.length > 500) {
      newErrors.storyExploring = 'Story exploring must be 500 characters or less';
    }

    if (!formData.theme) {
      newErrors.theme = 'Theme is required';
    }

    if (!formData.interviewRequest) {
      newErrors.interviewRequest = 'Interview request is required';
    }

    if (!formData.accessToTeam) {
      newErrors.accessToTeam = 'Access to Team is required';
    }

    if (!formData.preferredTimeline) {
      newErrors.preferredTimeline = 'Preferred timeline is required';
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
      const response = await fetch('/api/media-signup', {
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
          mediaType: '',
          organizationChannelHandle: '',
          storyExploring: '',
          theme: '',
          interviewRequest: '',
          assetsPressKit: false,
          assetsLogosBrandAssets: false,
          assetsFounderBioPack: false,
          assetsProductCaptures: false,
          assetsResearchData: false,
          accessToTeam: '',
          preferredTimeline: '',
          specificQuestions: '',
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
    <div className="media-tone">
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
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
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
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
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
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                  errors.phone ? 'border-red-500' : ''
                }`}
                maxLength={50}
              />
              {errors.phone && (
                <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <Label htmlFor="mediaType" className="text-white font-medium mb-2 block">
                Media Type *
              </Label>
              <Select
                value={formData.mediaType}
                onValueChange={(value) => {
                  setFormData({ ...formData, mediaType: value });
                  if (errors.mediaType) {
                    setErrors({ ...errors, mediaType: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                    errors.mediaType ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="journalist">Journalist</SelectItem>
                  <SelectItem value="youtuber">YouTuber</SelectItem>
                  <SelectItem value="podcaster">Podcaster</SelectItem>
                  <SelectItem value="researcher">Researcher</SelectItem>
                  <SelectItem value="blogger">Blogger</SelectItem>
                  <SelectItem value="social-creator">Social Creator</SelectItem>
                  <SelectItem value="zenzer">Zenzer</SelectItem>
                </SelectContent>
              </Select>
              {errors.mediaType && (
                <p className="text-red-400 text-sm mt-1">{errors.mediaType}</p>
              )}
            </div>

            <div>
              <Label htmlFor="organizationChannelHandle" className="text-white font-medium mb-2 block">
                Organization / Channel / Handle *
              </Label>
              <Input
                id="organizationChannelHandle"
                type="text"
                value={formData.organizationChannelHandle}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 200) {
                    setFormData({ ...formData, organizationChannelHandle: value });
                    if (errors.organizationChannelHandle) {
                      setErrors({ ...errors, organizationChannelHandle: undefined });
                    }
                  }
                }}
                placeholder="Enter your organization, channel, or handle"
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                  errors.organizationChannelHandle ? 'border-red-500' : ''
                }`}
                maxLength={200}
              />
              {errors.organizationChannelHandle && (
                <p className="text-red-400 text-sm mt-1">{errors.organizationChannelHandle}</p>
              )}
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="space-y-4 border-t border-blue-400/20 pt-6">
            <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Additional Notes</h3>

            <div>
              <Label htmlFor="specificQuestions" className="text-white font-medium mb-2 block">
                Any specific questions for the team?
              </Label>
              <Textarea
                id="specificQuestions"
                value={formData.specificQuestions}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 1000) {
                    setFormData({ ...formData, specificQuestions: value });
                    if (errors.specificQuestions) {
                      setErrors({ ...errors, specificQuestions: undefined });
                    }
                  }
                }}
                placeholder="Ask any specific questions for the team..."
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 min-h-[120px] ${
                  errors.specificQuestions ? 'border-red-500' : ''
                }`}
                maxLength={1000}
              />
              <p className="text-gray-400 text-xs mt-1">
                {formData.specificQuestions.length}/1000 characters
              </p>
              {errors.specificQuestions && (
                <p className="text-red-400 text-sm mt-1">{errors.specificQuestions}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 flex flex-col">
          {/* Coverage Intent Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Coverage Intent</h3>

            <div>
              <Label htmlFor="storyExploring" className="text-white font-medium mb-2 block">
                What story are you exploring? *
              </Label>
              <Textarea
                id="storyExploring"
                value={formData.storyExploring}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 500) {
                    setFormData({ ...formData, storyExploring: value });
                    if (errors.storyExploring) {
                      setErrors({ ...errors, storyExploring: undefined });
                    }
                  }
                }}
                placeholder="Describe the story you're exploring..."
                className={`w-full bg-slate-800/50 text-white border-blue-400/30 min-h-[100px] ${
                  errors.storyExploring ? 'border-red-500' : ''
                }`}
                maxLength={500}
              />
              <p className="text-gray-400 text-xs mt-1">
                {formData.storyExploring.length}/500 characters
              </p>
              {errors.storyExploring && (
                <p className="text-red-400 text-sm mt-1">{errors.storyExploring}</p>
              )}
            </div>

            <div>
              <Label htmlFor="theme" className="text-white font-medium mb-2 block">
                Which theme? *
              </Label>
              <Select
                value={formData.theme}
                onValueChange={(value) => {
                  setFormData({ ...formData, theme: value });
                  if (errors.theme) {
                    setErrors({ ...errors, theme: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                    errors.theme ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="integrity-economy">Integrity Economy</SelectItem>
                  <SelectItem value="human-ai">Human+AI</SelectItem>
                  <SelectItem value="debate">Debate</SelectItem>
                  <SelectItem value="dialog">Dialog</SelectItem>
                  <SelectItem value="cri">CRI</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="team-culture">Team & Culture</SelectItem>
                </SelectContent>
              </Select>
              {errors.theme && (
                <p className="text-red-400 text-sm mt-1">{errors.theme}</p>
              )}
            </div>

            <div>
              <Label htmlFor="interviewRequest" className="text-white font-medium mb-2 block">
                Interview request? *
              </Label>
              <Select
                value={formData.interviewRequest}
                onValueChange={(value) => {
                  setFormData({ ...formData, interviewRequest: value });
                  if (errors.interviewRequest) {
                    setErrors({ ...errors, interviewRequest: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                    errors.interviewRequest ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              {errors.interviewRequest && (
                <p className="text-red-400 text-sm mt-1">{errors.interviewRequest}</p>
              )}
            </div>
          </div>

          {/* Engagement Needs Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-4 font-sans tone-highlight">Engagement Needs</h3>

            <div>
              <Label className="text-white font-medium mb-3 block">
                What assets do you need?
              </Label>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="assetsPressKit"
                    checked={formData.assetsPressKit}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, assetsPressKit: checked === true })
                    }
                  />
                  <Label htmlFor="assetsPressKit" className="text-white font-normal cursor-pointer">
                    Press Kit
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="assetsLogosBrandAssets"
                    checked={formData.assetsLogosBrandAssets}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, assetsLogosBrandAssets: checked === true })
                    }
                  />
                  <Label htmlFor="assetsLogosBrandAssets" className="text-white font-normal cursor-pointer">
                    Logos & Brand Assets
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="assetsFounderBioPack"
                    checked={formData.assetsFounderBioPack}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, assetsFounderBioPack: checked === true })
                    }
                  />
                  <Label htmlFor="assetsFounderBioPack" className="text-white font-normal cursor-pointer">
                    Founder Bio Pack
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="assetsProductCaptures"
                    checked={formData.assetsProductCaptures}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, assetsProductCaptures: checked === true })
                    }
                  />
                  <Label htmlFor="assetsProductCaptures" className="text-white font-normal cursor-pointer">
                    Product Captures
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox
                    id="assetsResearchData"
                    checked={formData.assetsResearchData}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, assetsResearchData: checked === true })
                    }
                  />
                  <Label htmlFor="assetsResearchData" className="text-white font-normal cursor-pointer">
                    Research Data
                  </Label>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="accessToTeam" className="text-white font-medium mb-2 block">
                Access to Team *
              </Label>
              <Select
                value={formData.accessToTeam}
                onValueChange={(value) => {
                  setFormData({ ...formData, accessToTeam: value });
                  if (errors.accessToTeam) {
                    setErrors({ ...errors, accessToTeam: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                    errors.accessToTeam ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
              {errors.accessToTeam && (
                <p className="text-red-400 text-sm mt-1">{errors.accessToTeam}</p>
              )}
            </div>

            <div>
              <Label htmlFor="preferredTimeline" className="text-white font-medium mb-2 block">
                Preferred timeline *
              </Label>
              <Select
                value={formData.preferredTimeline}
                onValueChange={(value) => {
                  setFormData({ ...formData, preferredTimeline: value });
                  if (errors.preferredTimeline) {
                    setErrors({ ...errors, preferredTimeline: undefined });
                  }
                }}
              >
                <SelectTrigger
                  className={`w-full bg-slate-800/50 text-white border-blue-400/30 ${
                    errors.preferredTimeline ? 'border-red-500' : ''
                  }`}
                >
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP</SelectItem>
                  <SelectItem value="1-week">Within 1 week</SelectItem>
                  <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                  <SelectItem value="1-month">Within 1 month</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
              {errors.preferredTimeline && (
                <p className="text-red-400 text-sm mt-1">{errors.preferredTimeline}</p>
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
            'Submit Media Request'
          )}
        </button>
      </div>
    </form>
    </div>
  );
}


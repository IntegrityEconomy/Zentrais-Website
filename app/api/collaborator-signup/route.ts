import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend lazily to avoid build-time errors when API key is not available
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
};

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();

    const escapeHtml = (text: string) => {
      return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    const collaborationTypes = [];
    if (formData.collaborationTechnologyIntegration) collaborationTypes.push('Technology Integration');
    if (formData.collaborationContentDialog) collaborationTypes.push('Content & Dialog');
    if (formData.collaborationMarketplaceParticipation) collaborationTypes.push('Marketplace Participation');
    if (formData.collaborationResearchContribution) collaborationTypes.push('Research Contribution');
    if (formData.collaborationStrategicPartnership) collaborationTypes.push('Strategic Partnership');

    const emailBodyHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4a5568; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
            Collaborator / Brand Form Submission
          </h2>
          
          <h3 style="color: #2d3748; margin-top: 20px;">CONTACT INFO:</h3>
          <p><strong>Full Name:</strong> ${escapeHtml(formData.fullName || '')}</p>
          <p><strong>Email:</strong> ${escapeHtml(formData.email || '')}</p>
          <p><strong>Phone:</strong> ${escapeHtml(formData.phone || '')}</p>
          <p><strong>Company / Brand Name:</strong> ${escapeHtml(formData.companyBrandName || '')}</p>
          <p><strong>Country / City:</strong> ${escapeHtml(formData.countryCity || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">PARTNER PROFILE:</h3>
          <p><strong>Type:</strong> ${escapeHtml(formData.partnerType || '')}</p>
          <p><strong>Website / Portfolio link:</strong> ${escapeHtml(formData.websitePortfolio || '')}</p>
          <p><strong>Size:</strong> ${escapeHtml(formData.size || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">COLLABORATION INTENT:</h3>
          <p><strong>What kind of collaboration are you proposing:</strong> ${collaborationTypes.length > 0 ? collaborationTypes.join(', ') : 'None selected'}</p>
          <p><strong>Short description of your proposal:</strong> ${escapeHtml(formData.proposalDescription || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">VALUE EXCHANGE:</h3>
          <p><strong>What value do you bring to Zentrais:</strong> ${escapeHtml(formData.valueYouBring || '')}</p>
          <p><strong>What value do you expect from Zentrais:</strong> ${escapeHtml(formData.valueYouExpect || '')}</p>
        </body>
      </html>
    `;

    const emailBodyText = `Collaborator / Brand Form Submission

CONTACT INFO:
Full Name: ${formData.fullName || ''}
Email: ${formData.email || ''}
Phone: ${formData.phone || ''}
Company / Brand Name: ${formData.companyBrandName || ''}
Country / City: ${formData.countryCity || ''}

PARTNER PROFILE:
Type: ${formData.partnerType || ''}
Website / Portfolio link: ${formData.websitePortfolio || ''}
Size: ${formData.size || ''}

COLLABORATION INTENT:
What kind of collaboration are you proposing: ${collaborationTypes.length > 0 ? collaborationTypes.join(', ') : 'None selected'}
Short description of your proposal: ${formData.proposalDescription || ''}

VALUE EXCHANGE:
What value do you bring to Zentrais: ${formData.valueYouBring || ''}
What value do you expect from Zentrais: ${formData.valueYouExpect || ''}`;

    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.RESEND_TO_EMAIL_COLLAB || 'tech@zentrais.com',
      replyTo: formData.email || undefined,
      subject: 'Collaborator / Brand Form Submission - Zentrais',
      html: emailBodyHtml,
      text: emailBodyText,
    });

    if (error) {
      console.error('Resend API Error:', error);
      throw new Error(error.message || 'Failed to send email');
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Form submitted successfully',
      emailId: data?.id 
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
}


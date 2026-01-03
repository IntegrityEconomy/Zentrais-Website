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

    // Format the email body with all form data (include all fields, even if empty)
    // Using HTML format to prevent strikethrough issues and improve readability
    const escapeHtml = (text: string) => {
      return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    };

    // Format materials checkboxes
    const materials = [];
    if (formData.materialsPitchDeck) materials.push('Pitch Deck');
    if (formData.materialsDataRoom) materials.push('Data Room');
    if (formData.materialsTechnicalArchitecture) materials.push('Technical Architecture');
    if (formData.materialsCRIWhitepaper) materials.push('CRI Whitepaper');
    if (formData.materialsFinancialModel) materials.push('Financial Model');
    const materialsList = materials.length > 0 ? materials.join(', ') : 'None selected';

    const emailBodyHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4a5568; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
            Investor Form Submission
          </h2>
          
          <h3 style="color: #2d3748; margin-top: 20px;">CONTACT INFO:</h3>
          <p><strong>Full Name:</strong> ${escapeHtml(formData.fullName || '')}</p>
          <p><strong>Email:</strong> ${escapeHtml(formData.email || '')}</p>
          <p><strong>Phone:</strong> ${escapeHtml(formData.phone || '')}</p>
          <p><strong>Country/City:</strong> ${escapeHtml(formData.countryCity || '')}</p>
          <p><strong>Organization / Fund Name:</strong> ${escapeHtml(formData.organizationFundName || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">INVESTOR PROFILE:</h3>
          <p><strong>Type:</strong> ${escapeHtml(formData.investorType || '')}</p>
          <p><strong>Fund Size or Investment Capacity:</strong> ${escapeHtml(formData.fundSize || '')}</p>
          <p><strong>Typical Check Size:</strong> ${escapeHtml(formData.typicalCheckSize || '')}</p>
          <p><strong>Preferred Sectors or Thesis Focus:</strong> ${escapeHtml(formData.preferredSectors || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">INTEREST IN ZENTRAIS:</h3>
          <p><strong>What about Zentrais captured your interest:</strong> ${escapeHtml(formData.whatCapturedInterest || '')}</p>
          <p><strong>Which components matter most:</strong> ${escapeHtml(formData.componentsMatterMost || '')}</p>
          <p><strong>Investment Time Horizon:</strong> ${escapeHtml(formData.investmentTimeHorizon || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">DUE DILIGENCE NEEDS:</h3>
          <p><strong>What materials do you want access to:</strong> ${escapeHtml(materialsList)}</p>
          <p><strong>Do you want a meeting with Founders:</strong> ${escapeHtml(formData.wantMeetingWithFounders || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">QUESTIONS / NOTES:</h3>
          <p><strong>Any questions for the Founders:</strong> ${escapeHtml(formData.questionsForFounders || '')}</p>
        </body>
      </html>
    `;

    // Plain text version as fallback
    const emailBodyText = `Investor Form Submission

CONTACT INFO:
Full Name: ${formData.fullName || ''}
Email: ${formData.email || ''}
Phone: ${formData.phone || ''}
Country/City: ${formData.countryCity || ''}
Organization / Fund Name: ${formData.organizationFundName || ''}

INVESTOR PROFILE:
Type: ${formData.investorType || ''}
Fund Size or Investment Capacity: ${formData.fundSize || ''}
Typical Check Size: ${formData.typicalCheckSize || ''}
Preferred Sectors or Thesis Focus: ${formData.preferredSectors || ''}

INTEREST IN ZENTRAIS:
What about Zentrais captured your interest: ${formData.whatCapturedInterest || ''}
Which components matter most: ${formData.componentsMatterMost || ''}
Investment Time Horizon: ${formData.investmentTimeHorizon || ''}

DUE DILIGENCE NEEDS:
What materials do you want access to: ${materialsList}
Do you want a meeting with Founders: ${formData.wantMeetingWithFounders || ''}

QUESTIONS / NOTES:
Any questions for the Founders: ${formData.questionsForFounders || ''}`;

    // Send email using Resend
    // Email addresses are configured in .env.local
    // This is the investor form, so using RESEND_TO_EMAIL_INVES
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.RESEND_TO_EMAIL_INVES || 'tech@zentrais.com',
      replyTo: formData.email || undefined, // Set reply-to to the investor's email
      subject: 'Investor Form Submission - Zentrais',
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
      emailId: data?.id,
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to submit form';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}


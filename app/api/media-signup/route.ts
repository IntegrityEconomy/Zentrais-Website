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

    const assets = [];
    if (formData.assetsPressKit) assets.push('Press Kit');
    if (formData.assetsLogosBrandAssets) assets.push('Logos & Brand Assets');
    if (formData.assetsFounderBioPack) assets.push('Founder Bio Pack');
    if (formData.assetsProductCaptures) assets.push('Product Captures');
    if (formData.assetsResearchData) assets.push('Research Data');
    const assetsList = assets.length > 0 ? assets.join(', ') : 'None selected';

    const emailBodyHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4a5568; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
            Media / Zenzers Form Submission
          </h2>
          
          <h3 style="color: #2d3748; margin-top: 20px;">CONTACT INFO:</h3>
          <p><strong>Full Name:</strong> ${escapeHtml(formData.fullName || '')}</p>
          <p><strong>Email:</strong> ${escapeHtml(formData.email || '')}</p>
          <p><strong>Phone:</strong> ${escapeHtml(formData.phone || '')}</p>
          <p><strong>Media Type:</strong> ${escapeHtml(formData.mediaType || '')}</p>
          <p><strong>Organization / Channel / Handle:</strong> ${escapeHtml(formData.organizationChannelHandle || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">COVERAGE INTENT:</h3>
          <p><strong>What story are you exploring:</strong> ${escapeHtml(formData.storyExploring || '')}</p>
          <p><strong>Which theme:</strong> ${escapeHtml(formData.theme || '')}</p>
          <p><strong>Interview request:</strong> ${escapeHtml(formData.interviewRequest || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">ENGAGEMENT NEEDS:</h3>
          <p><strong>What assets do you need:</strong> ${escapeHtml(assetsList)}</p>
          <p><strong>Access to Team:</strong> ${escapeHtml(formData.accessToTeam || '')}</p>
          <p><strong>Preferred timeline:</strong> ${escapeHtml(formData.preferredTimeline || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">ADDITIONAL NOTES:</h3>
          <p><strong>Any specific questions for the team:</strong> ${escapeHtml(formData.specificQuestions || '')}</p>
        </body>
      </html>
    `;

    const emailBodyText = `Media / Zenzers Form Submission

CONTACT INFO:
Full Name: ${formData.fullName || ''}
Email: ${formData.email || ''}
Phone: ${formData.phone || ''}
Media Type: ${formData.mediaType || ''}
Organization / Channel / Handle: ${formData.organizationChannelHandle || ''}

COVERAGE INTENT:
What story are you exploring: ${formData.storyExploring || ''}
Which theme: ${formData.theme || ''}
Interview request: ${formData.interviewRequest || ''}

ENGAGEMENT NEEDS:
What assets do you need: ${assetsList}
Access to Team: ${formData.accessToTeam || ''}
Preferred timeline: ${formData.preferredTimeline || ''}

ADDITIONAL NOTES:
Any specific questions for the team: ${formData.specificQuestions || ''}`;

    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.RESEND_TO_EMAIL_MEDIA || 'tech@zentrais.com',
      replyTo: formData.email || undefined,
      subject: 'Media / Zenzers Form Submission - Zentrais',
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

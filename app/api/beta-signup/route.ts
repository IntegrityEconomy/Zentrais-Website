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

    const emailBodyHtml = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #4a5568; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
            Beta User Signup Form Submission
          </h2>
          
          <h3 style="color: #2d3748; margin-top: 20px;">CONTACT INFO:</h3>
          <p><strong>Full Name:</strong> ${escapeHtml(formData.fullName || '')}</p>
          <p><strong>Email:</strong> ${escapeHtml(formData.email || '')}</p>
          <p><strong>Country/City:</strong> ${escapeHtml(formData.countryCity || '')}</p>
          <p><strong>Preferred Language:</strong> ${escapeHtml(formData.preferredLanguage || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">USER PROFILE:</h3>
          <p><strong>Age Range:</strong> ${escapeHtml(formData.ageRange || '')}</p>
          <p><strong>Occupation:</strong> ${escapeHtml(formData.occupation || '')}</p>
          <p><strong>AI Platform Familiarity:</strong> ${escapeHtml(formData.aiFamiliarity || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">INTEREST IN ZENTRAIS:</h3>
          <p><strong>What brought you here today:</strong> ${escapeHtml(formData.whatBroughtYou || '')}</p>
          <p><strong>Which engine interests you most:</strong> ${escapeHtml(formData.engineInterest || '')}</p>
          <p><strong>What problem do you hope Zentrais solves for you:</strong> ${escapeHtml(formData.problemToSolve || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">EXPERIENCE EXPECTATIONS:</h3>
          <p><strong>What do you expect from the Beta:</strong> ${escapeHtml(formData.betaExpectations || '')}</p>
          <p><strong>What feature do you want to test first:</strong> ${escapeHtml(formData.featureToTest || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">FEEDBACK / QUESTIONS:</h3>
          <p><strong>What's missing or unclear on the website:</strong> ${escapeHtml(formData.whatsMissing || '')}</p>
          <p><strong>Any blockers that would prevent you from joining Beta:</strong> ${escapeHtml(formData.blockers || '')}</p>
          <p><strong>Any additional comments or questions:</strong> ${escapeHtml(formData.additionalComments || '')}</p>
          
          <h3 style="color: #2d3748; margin-top: 20px;">CONSENT:</h3>
          <p><strong>Agrees to receive Beta updates:</strong> ${formData.consent ? 'Yes' : 'No'}</p>
        </body>
      </html>
    `;

    // Plain text version as fallback
    const emailBodyText = `Beta User Signup Form Submission

CONTACT INFO:
Full Name: ${formData.fullName || ''}
Email: ${formData.email || ''}
Country/City: ${formData.countryCity || ''}
Preferred Language: ${formData.preferredLanguage || ''}

USER PROFILE:
Age Range: ${formData.ageRange || ''}
Occupation: ${formData.occupation || ''}
AI Platform Familiarity: ${formData.aiFamiliarity || ''}

INTEREST IN ZENTRAIS:
What brought you here today: ${formData.whatBroughtYou || ''}
Which engine interests you most: ${formData.engineInterest || ''}
What problem do you hope Zentrais solves for you: ${formData.problemToSolve || ''}

EXPERIENCE EXPECTATIONS:
What do you expect from the Beta: ${formData.betaExpectations || ''}
What feature do you want to test first: ${formData.featureToTest || ''}

FEEDBACK / QUESTIONS:
What's missing or unclear on the website: ${formData.whatsMissing || ''}
Any blockers that would prevent you from joining Beta: ${formData.blockers || ''}
Any additional comments or questions: ${formData.additionalComments || ''}

CONSENT:
Agrees to receive Beta updates: ${formData.consent ? 'Yes' : 'No'}`;

    // Send email using Resend
    // Email addresses are configured in .env.local
    // This is the user form, so using RESEND_TO_EMAIL_USER
    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.RESEND_TO_EMAIL_USER || 'tech@zentrais.com',
      replyTo: formData.email || undefined, // Set reply-to to the user's email
      subject: 'Beta User Signup - Zentrais',
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

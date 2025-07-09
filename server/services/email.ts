import { MailService } from '@sendgrid/mail';
import { Invitation } from '@shared/schema';

const mailService = new MailService();

if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@insightengine.com';
const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

export async function sendInvitationEmail(
  invitation: Invitation,
  userName: string
): Promise<boolean> {
  try {
    const surveyUrl = `${BASE_URL}/survey/${invitation.token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>360° Feedback Request from ${userName}</title>
        <style>
          body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e2e8f0; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; border-radius: 0 0 12px 12px; }
          .privacy { background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>360° Feedback Request</h1>
            <p>Your insights will help ${userName} grow</p>
          </div>
          
          <div class="content">
            <p>Hello ${invitation.name},</p>
            
            <p>${userName} has invited you to participate in a 360° feedback survey. Your honest insights will help them understand their strengths and areas for growth.</p>
            
            <div class="privacy">
              <strong>🔒 Your Privacy is Protected</strong><br>
              Your responses are completely anonymous. ${userName} will see the aggregated insights but never know who said what.
            </div>
            
            <p><strong>What to expect:</strong></p>
            <ul>
              <li>10-12 thoughtful questions about ${userName}</li>
              <li>Takes about 8-10 minutes to complete</li>
              <li>Focus areas: ${invitation.relationship} perspective</li>
              <li>Optional text responses for examples</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${surveyUrl}" class="button">Start Survey</a>
            </div>
            
            <p>Your honest feedback is a gift that will help ${userName} become even more effective in their role.</p>
            
            <p>Thank you for taking the time to contribute!</p>
          </div>
          
          <div class="footer">
            <p>This survey was created through InsightEngine - 360° Self-Insight Platform</p>
            <p>If you have questions, please reply to this email.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      ${userName} has invited you to participate in a 360° feedback survey.
      
      Your responses are completely anonymous and will help ${userName} understand their strengths and growth areas.
      
      Complete the survey here: ${surveyUrl}
      
      Expected time: 8-10 minutes
      
      Thank you for your honest feedback!
    `;

    await mailService.send({
      to: invitation.email,
      from: FROM_EMAIL,
      subject: `360° Feedback Request from ${userName}`,
      text,
      html,
    });

    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export async function sendReminderEmail(
  invitation: Invitation,
  userName: string
): Promise<boolean> {
  try {
    const surveyUrl = `${BASE_URL}/survey/${invitation.token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reminder: 360° Feedback for ${userName}</title>
        <style>
          body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #1e293b; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669, #2563eb); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
          .content { background: white; padding: 30px; border: 1px solid #e2e8f0; }
          .button { display: inline-block; background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          .footer { background: #f8fafc; padding: 20px; text-align: center; color: #64748b; font-size: 14px; border-radius: 0 0 12px 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Friendly Reminder</h1>
            <p>360° Feedback for ${userName}</p>
          </div>
          
          <div class="content">
            <p>Hello ${invitation.name},</p>
            
            <p>This is a friendly reminder about the 360° feedback survey for ${userName}. We know you're busy, but your insights would be incredibly valuable.</p>
            
            <p><strong>Just 8-10 minutes</strong> of your time can make a real difference in ${userName}'s development.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${surveyUrl}" class="button">Complete Survey</a>
            </div>
            
            <p>Remember: Your responses are completely anonymous.</p>
            
            <p>Thank you for your support!</p>
          </div>
          
          <div class="footer">
            <p>InsightEngine - 360° Self-Insight Platform</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await mailService.send({
      to: invitation.email,
      from: FROM_EMAIL,
      subject: `Reminder: 360° Feedback for ${userName}`,
      html,
    });

    return true;
  } catch (error) {
    console.error('SendGrid reminder email error:', error);
    return false;
  }
}

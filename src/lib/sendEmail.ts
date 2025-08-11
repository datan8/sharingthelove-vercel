import { env } from './env';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface EmailResponse {
  success: boolean;
  message: string;
}

export async function sendContactEmail(formData: ContactFormData): Promise<EmailResponse> {
  try {
    // Debug logs
    console.log('Environment:', {
      mode: import.meta.env.MODE,
      apiBaseUrl: env.apiBaseUrl,
      rawApiBaseUrl: import.meta.env.VITE_API_BASE_URL,
      sendGridFromEmail: env.sendGridFromEmail,
      sendGridToEmail: env.sendGridToEmail,
      allEnv: import.meta.env
    });

    // Ensure we have a valid API URL
    if (!env.apiBaseUrl) {
      throw new Error('API Base URL is not configured');
    }

    // Remove any trailing slashes and ensure proper URL formatting
    const baseUrl = env.apiBaseUrl.replace(/\/$/, '');
    const apiUrl = `${baseUrl}/sendEmail`;
    
    console.log('Sending request to:', apiUrl);

    // Prepare the email data with SendGrid configuration
    const emailData = {
      ...formData,
      fromEmail: env.sendGridFromEmail,
      toEmail: env.sendGridToEmail,
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-functions-key': env.azureFunctionKey || '',
      },
      body: JSON.stringify(emailData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to send email');
    }

    return {
      success: true,
      message: 'Email sent successfully',
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send email',
    };
  }
}

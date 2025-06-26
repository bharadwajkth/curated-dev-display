import emailjs from 'emailjs-com';

// Validate that all required EmailJS environment variables are present
const requiredEmailJSVars = [
  'VITE_EMAILJS_SERVICE_ID',
  'VITE_EMAILJS_TEMPLATE_ID',
  'VITE_EMAILJS_PUBLIC_KEY'
];

const missingEmailJSVars = requiredEmailJSVars.filter(varName => !import.meta.env[varName]);

if (missingEmailJSVars.length > 0) {
  console.warn(
    `Missing EmailJS environment variables: ${missingEmailJSVars.join(', ')}\n` +
    'Email functionality will not work. Please set up EmailJS configuration in your .env file.'
  );
}

// EmailJS configuration
export const emailJSConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
};

// Check if EmailJS is properly configured
export const isEmailJSConfigured = () => {
  return emailJSConfig.serviceId && 
         emailJSConfig.templateId && 
         emailJSConfig.publicKey;
};

// Initialize EmailJS
if (isEmailJSConfigured()) {
  emailjs.init(emailJSConfig.publicKey);
  console.log('EmailJS initialized successfully');
} else {
  console.warn('EmailJS not configured. Email functionality will be disabled.');
}

// Interface for contact form data
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Function to send email using EmailJS
export const sendContactEmail = async (formData: ContactFormData): Promise<void> => {
  if (!isEmailJSConfigured()) {
    throw new Error(
      'EmailJS is not configured. Please set up your EmailJS environment variables.\n\n' +
      'Steps to configure:\n' +
      '1. Go to https://www.emailjs.com/\n' +
      '2. Create an account and set up a service\n' +
      '3. Create an email template\n' +
      '4. Add your credentials to the .env file'
    );
  }

  try {
    console.log('Sending email with EmailJS...', formData);
    
    // Prepare template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: 'Bharadwaj', // Your name
      reply_to: formData.email,
      // Add timestamp for reference
      timestamp: new Date().toLocaleString()
    };

    // Send email using EmailJS
    const response = await emailjs.send(
      emailJSConfig.serviceId,
      emailJSConfig.templateId,
      templateParams
    );

    console.log('Email sent successfully:', response);
    
    if (response.status !== 200) {
      throw new Error(`EmailJS returned status: ${response.status}`);
    }
    
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Provide user-friendly error messages
    if (error instanceof Error) {
      if (error.message.includes('network')) {
        throw new Error('Network error. Please check your internet connection and try again.');
      } else if (error.message.includes('template')) {
        throw new Error('Email template error. Please contact the site administrator.');
      } else if (error.message.includes('service')) {
        throw new Error('Email service error. Please try again later.');
      }
    }
    
    throw new Error('Failed to send email. Please try again or contact me directly at bharatkth2020@gmail.com');
  }
};

// Export emailjs for direct use if needed
export { emailjs };
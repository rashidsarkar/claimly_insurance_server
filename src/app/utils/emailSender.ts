import { ClientSecretCredential } from '@azure/identity';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from '@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials';
import config from '../config';

export const emailSender = async (toEmail: string, htmlText: string) => {
  try {
    // ১. আপনার Azure ক্রেডেনশিয়াল ব্যবহার করে অথেন্টিকেশন
    const credential = new ClientSecretCredential(
      config.tenant_id!,
      config.client_id!,
      config.client_secret!,
    );

    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ['https://graph.microsoft.com/.default'],
    });

    // ২. মাইক্রোসফট গ্রাফ ক্লায়েন্ট তৈরি
    const graphClient = Client.initWithMiddleware({ authProvider });

    // ৩. ইমেইল মেসেজ তৈরি
    const sendMail = {
      message: {
        subject: 'Mail from your app',
        body: {
          contentType: 'HTML',
          content: htmlText,
        },
        toRecipients: [
          {
            emailAddress: {
              address: toEmail,
            },
          },
        ],
      },
      saveToSentItems: 'true',
    };

    // ৪. ইমেইল পাঠানো
    // এটি support@claimly.au থেকে মেইল পাঠাবে
    await graphClient
      .api(`/users/${config.outlook_email}/sendMail`)
      .post(sendMail);

    console.log('Email sent successfully via Azure Graph API');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

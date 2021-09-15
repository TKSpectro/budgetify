import nodemailer from 'nodemailer';

interface createTransporterProps {
  enableLogger?: boolean;
}

export const createNodemailerTransporter = ({ enableLogger = true }: createTransporterProps) => {
  const account = getEmailAccount();

  if (!account) return null;

  return nodemailer.createTransport({
    host: account.host,
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: account.user,
      pass: account.pass,
    },
    logger: enableLogger,
  });
};

const getEmailAccount = () => {
  let account = { host: '', user: '', pass: '' };

  // Check if email is even enabled
  if (process.env.EMAIL_ENABLE !== 'true') {
    return null;
  }

  if (process.env.EMAIL_ENABLE === 'true') {
    // Check which email account to use based on .env configuration
    if (process.env.EMAIL_ETHEREAL === 'true') {
      // Switch between ethereal fake email catcher and real email service
      // Ethereal: https://ethereal.email/
      account.host = process.env.EMAIL_ETHEREAL_HOST!;
      account.user = process.env.EMAIL_ETHEREAL_USER!;
      account.pass = process.env.EMAIL_ETHEREAL_PASS!;
    } else {
      account.host = process.env.EMAIL_HOST!;
      account.user = process.env.EMAIL_USER!;
      account.pass = process.env.EMAIL_PASS!;
    }
  }

  return account;
};

import nodemailer from "nodemailer";
import { getEnv } from "@/lib/env";
import { resetPasswordTemplate, matchWinnerTemplate, EmailTemplate } from "@/lib/email/templates";

type MailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

const buildTransporter = () => {
  const env = getEnv();
  const hasSmtp = env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS;

  if (!hasSmtp) {
    // Fallback to JSON transport so local/dev does not throw
    return nodemailer.createTransport({
      jsonTransport: true,
    });
  }

  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE ?? false,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

const transporter = buildTransporter();

const sendMail = async ({ to, subject, html, text }: MailPayload) => {
  const env = getEnv();
  const from = env.SMTP_FROM || env.SMTP_USER || "no-reply@skillarena.gg";

  return transporter.sendMail({
    from,
    to,
    subject,
    html,
    text,
  });
};

export const sendResetPasswordEmail = async (to: string, params: EmailTemplate["resetPassword"]) => {
  const template = resetPasswordTemplate(params);
  return sendMail({ to, ...template });
};

export const sendMatchWinnerEmail = async (to: string, params: EmailTemplate["matchWinner"]) => {
  const template = matchWinnerTemplate(params);
  return sendMail({ to, ...template });
};

export { resetPasswordTemplate, matchWinnerTemplate };

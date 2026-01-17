import nodemailer from "nodemailer";
import { getEnv } from "@/lib/env";
import {
  resetPasswordTemplate,
  matchWinnerTemplate,
  verifyEmailTemplate,
  matchRoomDetailsTemplate,
  EmailTemplate,
} from "@/lib/email/templates";

type MailPayload = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

const buildTransporter = () => {
  const env = getEnv();
  const smtpPass = env.SMTP_PASS ?? env.SMTP_PASSWORD;
  const hasSmtp = env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USERNAME && smtpPass;

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
      user: env.SMTP_USERNAME,
      pass: smtpPass,
    },
  });
};

const transporter = buildTransporter();

const sendMail = async ({ to, subject, html, text }: MailPayload) => {
  const env = getEnv();
  const from = env.SMTP_USERNAME;

  try {
    const info = await transporter.sendMail({
      from,
      to,
      subject,
      html,
      text,
    });
    return info;
  } catch (error) {
    console.error("Email send failed", error);
    throw error;
  }
};

export const sendResetPasswordEmail = async (to: string, params: EmailTemplate["resetPassword"]) => {
  const template = resetPasswordTemplate(params);
  return sendMail({ to, ...template });
};

export const sendMatchWinnerEmail = async (to: string, params: EmailTemplate["matchWinner"]) => {
  const template = matchWinnerTemplate(params);
  return sendMail({ to, ...template });
};

export const sendVerifyEmail = async (to: string, params: EmailTemplate["verifyEmail"]) => {
  const template = verifyEmailTemplate(params);
  return sendMail({ to, ...template });
};

export const sendMatchRoomEmail = async (to: string, params: EmailTemplate["matchRoomDetails"]) => {
  const template = matchRoomDetailsTemplate(params);
  return sendMail({ to, ...template });
};

export { resetPasswordTemplate, matchWinnerTemplate, verifyEmailTemplate, matchRoomDetailsTemplate };

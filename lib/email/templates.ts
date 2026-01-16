export type EmailTemplate = {
  resetPassword: {
    name?: string;
    resetUrl: string;
  };
  matchWinner: {
    name?: string;
    matchName: string;
    position: number;
    prize?: string | number;
    matchUrl?: string;
  };
  verifyEmail: {
    name?: string;
    verifyUrl: string;
  };
};

const baseStyles = {
  body: "font-family: Arial, sans-serif; color: #0f172a;",
  button:
    "display:inline-block;padding:12px 18px;border-radius:10px;background:#10b981;color:#0f172a;text-decoration:none;font-weight:700;",
  muted: "color:#6b7280;font-size:12px;",
};

export const resetPasswordTemplate = ({ name, resetUrl }: EmailTemplate["resetPassword"]) => {
  const subject = "Reset your SkillArena password";
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const html = `
    <div style="${baseStyles.body}">
      <p>${greeting}</p>
      <p>We received a request to reset your password. Click the button below to choose a new password.</p>
      <p style="margin:18px 0">
        <a href="${resetUrl}" style="${baseStyles.button}">Reset Password</a>
      </p>
      <p>If you did not request this, you can safely ignore this email.</p>
      <p style="${baseStyles.muted}">This link will expire for security reasons.</p>
    </div>
  `;
  const text = `${greeting}\n\nReset your password:\n${resetUrl}\n\nIf you did not request this, ignore this email.`;
  return { subject, html, text };
};

export const matchWinnerTemplate = ({
  name,
  matchName,
  position,
  prize,
  matchUrl,
}: EmailTemplate["matchWinner"]) => {
  const subject = `Result: ${matchName} • Position ${position}`;
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const prizeLine = prize !== undefined ? `<p>Prize: <strong>${prize}</strong></p>` : "";
  const cta = matchUrl
    ? `<p style="margin:18px 0"><a href="${matchUrl}" style="${baseStyles.button}">View Match Details</a></p>`
    : "";

  const html = `
    <div style="${baseStyles.body}">
      <p>${greeting}</p>
      <p>Great run! Here are your results for <strong>${matchName}</strong>:</p>
      <p>Position: <strong>${position}</strong></p>
      ${prizeLine}
      ${cta}
      <p>Thanks for competing on SkillArena.</p>
    </div>
  `;

  const textLines = [
    greeting,
    "",
    `Results for ${matchName}:`,
    `Position: ${position}`,
    prize !== undefined ? `Prize: ${prize}` : "",
    matchUrl ? `View match: ${matchUrl}` : "",
    "",
    "Thanks for competing on SkillArena.",
  ].filter(Boolean);

  const text = textLines.join("\n");

  return { subject, html, text };
};

export const verifyEmailTemplate = ({ name, verifyUrl }: EmailTemplate["verifyEmail"]) => {
  const subject = "Verify your SkillArena email";
  const greeting = name ? `Hi ${name},` : "Hi there,";
  const html = `
    <div style="${baseStyles.body}">
      <p>${greeting}</p>
      <p>Please verify your email to unlock match registrations and important updates.</p>
      <p style="margin:18px 0">
        <a href="${verifyUrl}" style="${baseStyles.button}">Verify Email</a>
      </p>
      <p style="${baseStyles.muted}">If you did not create an account, you can ignore this email.</p>
    </div>
  `;
  const text = `${greeting}\n\nVerify your email:\n${verifyUrl}\n\nIf you did not create an account, ignore this email.`;
  return { subject, html, text };
};

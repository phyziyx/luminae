import nodemailer from "nodemailer";

// Define the email templates with type safety
type WelcomeTemplate = {
  name: string;
};

type PasswordResetTemplate = {
  name: string;
  resetLink: string;
};

type NotificationTemplate = {
  name: string;
  message: string;
  link?: string; // Optional link for additional context
};

type TeamInviteTemplate = {
  teamName: string;
  inviteLink: string;
};

export type EmailTemplatePlaceholders = {
  welcome: WelcomeTemplate;
  passwordReset: PasswordResetTemplate;
  notification: NotificationTemplate;
  teamInvite: TeamInviteTemplate;
};

type EmailTemplates = {
  [K in keyof EmailTemplatePlaceholders]: {
    slug: K;
    subject: string;
    html: string;
  };
};

const emailTemplateKeys: EmailTemplates = {
  welcome: {
    slug: "welcome",
    subject: "Welcome to Luminae!",
    html: "<p>Hello {{name}},</p><p>Welcome to Luminae! We're excited to have you on board.</p><p>Best regards,<br>The Luminae Team</p>",
  },
  passwordReset: {
    slug: "passwordReset",
    subject: "Reset Your Password",
    html: "<p>Hello {{name}},</p><p>To reset your password, please click the link below:</p><p><a href='{{resetLink}}'>Reset Password</a></p><p>Best regards,<br>The Luminae Team</p>",
  },
  notification: {
    slug: "notification",
    subject: "You Have a New Notification",
    html: "<p>Hello {{name}},</p><p>You have a new notification:</p><p>{{message}}</p>{{#if link}}<p>For more details, visit <a href='{{link}}'>here</a>.</p>{{/if}}<p>Best regards,<br>The Luminae Team</p>",
  },
  teamInvite: {
    slug: "teamInvite",
    subject: "You've Been Invited to Join a Team",
    html: "<p>Hello,</p><p>You've been invited to join the team {{teamName}}. Please click the link below to accept the invitation:</p><p><a href='{{inviteLink}}'>Join Team</a></p><p>Best regards,<br>The Luminae Team</p>",
  },
};

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || "587", 10),
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function replacePlaceholders(
  template: string,
  data: Record<string, string>
): string {
  return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || "");
}

export async function sendMail<T extends keyof EmailTemplatePlaceholders>(
  to: string,
  slug: T,
  data: EmailTemplatePlaceholders[T]
) {
  const template = emailTemplateKeys[slug];
  const subject = replacePlaceholders(
    template.subject,
    data as Record<string, string>
  );
  const html = replacePlaceholders(
    template.html,
    data as Record<string, string>
  );

  const message = {
    to: to.toLowerCase().trim(),
    from: process.env.EMAIL_FROM,
    subject: subject,
    html: html,
  };

  // Replace this with actual email logic
  console.log("Subject:", subject);
  console.log("HTML:", html);

  try {
    const info = await transporter.sendMail(message);
    console.log("Email sent:", info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (error) {
    console.error("Error sending email:", error);

    return {
      success: false,
      message: "Failed to send email. Please try again later...",
    };
  }
}

import {Resend} from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
const domain= process.env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;
//send email for reset password
  await resend.emails.send({
    from: "authentication@dheerajjha.com",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`,
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;
//send email for email verification 
  await resend.emails.send({
    from: "authentication@dheerajjha.com",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`,
  });
};

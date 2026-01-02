import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter
  .verify()
  .then(() => {
    console.log("SMTP transporter verified");
  })
  .catch((err) => {
    console.error(
      "SMTP transporter verification failed:",
      err && err.message ? err.message : err
    );
  });
// --------------------------AUTH----------------
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL!],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: { type: "string", defaultValue: "ACTIVE", required: false },
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // send token / generate token
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

      const info = await transporter.sendMail({
        from: '"Prisma Blog App" <prismablog@gmail.com>',
        to: user?.email,
        subject: "Please verify your email",
        text: "Hello world?", // Plain-text version of the message
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Email</title>

  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }

    .container {
      width: 100%;
      padding: 40px 0;
    }

    .email-box {
      width: 600px;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
    }

    .header {
      background: #2563eb;
      padding: 20px;
      text-align: center;
    }

    .header h1 {
      margin: 0;
      color: #ffffff;
      font-size: 24px;
    }

    .content {
      padding: 30px;
    }

    .content h2 {
      margin-top: 0;
      color: #111827;
    }

    .content p {
      color: #374151;
      font-size: 15px;
      line-height: 1.6;
    }

    .button-wrapper {
      text-align: center;
      margin: 30px 0;
    }

    .verify-button {
      background: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 6px;
      font-size: 16px;
      display: inline-block;
    }

    .link-text {
      font-size: 13px;
      color: #2563eb;
      word-break: break-all;
    }

    .footer {
      background: #f9fafb;
      padding: 20px;
      text-align: center;
    }

    .footer p {
      margin: 0;
      font-size: 12px;
      color: #9ca3af;
    }

    @media only screen and (max-width: 620px) {
      .email-box {
        width: 90% !important;
      }
    }
  </style>
</head>

<body>
  <table class="container" cellpadding="0" cellspacing="0" align="center">
    <tr>
      <td align="center">
        <table class="email-box" cellpadding="0" cellspacing="0">

          <!-- Header -->
          <tr>
            <td class="header">
              <h1>Prisma Blog App</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content">
              <h2>Verify your email address</h2>

              <p>
                Thank you ${
                  user?.email
                }  for signing up for <strong>Prisma Blog App</strong>.
                Please confirm your email address by clicking the button below.
              </p>

              <div class="button-wrapper">
                <a href="${verificationUrl}" class="verify-button">
                  Verify Email
                </a>
              </div>

              <p>
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p class="link-text">
                ${verificationUrl}
              </p>

              <p style="margin-top: 30px; font-size: 13px; color: #6b7280;">
                If you didn’t create an account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="footer">
              <p>
                © ${new Date().getFullYear()} Prisma Blog App. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
      });
      console.log("message sent : ", info.messageId);
    },
  },
});

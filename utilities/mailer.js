"use strict";
require("dotenv").config();
const nodemailer = require("nodemailer");
const { NODE_MAILER_EMAIL, NODE_MAILER_PASSWORD } = require("./constants");

async function mail({ to, verifierlink }) {
  const body = `<div style="justify-content: center; align-items: center; flex-direction: column; text-align: center; background-color: #191920; color: #fff; padding: 20px;" >
        <h1>
            Hello from Road Rakshak,
        </h1>
        <br/>
        <p>
            This email is sent to you because you registered yourself in the \`Road Rakshak\` application.
            To Verify your account click on the link below
        </p>
        <br/>
        <a href="${verifierlink}" >
            <h1>
                Verify
            </h1>
        </a>
        <p>This is an auto-generated mail used for Road Rakshak</p>
    </div>`;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtppro.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: NODE_MAILER_EMAIL,
      pass: NODE_MAILER_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: '"Road Rakshak" roadrakshakverifier@gmail.com',
    to: to,
    subject: "Account Verification",
    html: body,
  });
}

module.exports = mail;

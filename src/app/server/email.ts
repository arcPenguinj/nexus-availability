'use server'

import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

export async function sendEmail(date: string) {
  'use server';
  const mailerSend = new MailerSend({
    apiKey:
      "mlsn.6ab612f4eb1ac9065cc864690442b43f23a020b0a4c149d630ffef0b5bc14b9f",
  });

  const sentFrom = new Sender(
    "MS_d0r2Gu@bigcatarcpenguinsbrick.com",
    "Nexus Slot Checker"
  );

  const recipients = [
    new Recipient("yicizhu@gmail.com", "Yici Zhu"),
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject("Nexus Interview Slot Available!")
    .setHtml(
      `A new interview slot is available now at time <strong>${date}</strong>! Go and schedule <a
        href="https://ttp.cbp.dhs.gov/"
        target="_blank"
        rel="noopener noreferrer"
      >here</a>!`
    );

  const response = await mailerSend.email.send(emailParams);
  if (response.statusCode >= 300) {
    console.error("Failed to send email: ", response);
  }
};

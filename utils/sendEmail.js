const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
  };

  console.log("mail", mailOptions);

  !html
    ? (mailOptions.text = text)
    : (mailOptions.html = html) &&
      (mailOptions.text = htmlToText.htmlToText(String(html)));
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;

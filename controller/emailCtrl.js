const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data) => {
  try {
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
      // host: "smtp.gmail.com",
    // port: 465,
    // secure: true,
    // auth: {
    //   user: process.env.MAIL_ID,
    //   pass: process.env.MAIL_PWD,
    // },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Hey 👻" <abc@gmail.com>',
      to: data.to,
      subject: data.subject,
      text: data.text,
      html: data.html,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { sendEmail };

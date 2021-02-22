const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendWelcomeEmail = async (email, name) => {
  await sgMail.send({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Welcome",
    text: `Welcome to the Task App ${name}. Let me know how you get along with the app.`,
  });
};

const sendCancellationEmail = async (email, name) => {
  await sgMail.send({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: "Sad to see ya go",
    text: `Sad to see ya go ${name}. Let me know what did you miss and how to get you back.`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};

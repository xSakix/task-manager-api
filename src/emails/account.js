const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_KEY);

const sendWelcomeEmail = (email, name)=>{
    sgMail
      .send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: "Welcome",
        text: `Welcome to the Task App ${name}. Let me know how you get along with the app.`,
      })
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
};

const sendCancellationEmail = (email, name)=>{
    sgMail
      .send({
        to: email,
        from: process.env.EMAIL_FROM,
        subject: "Sad to see ya go",
        text: `Sad to see ya go ${name}. Let me know what did you miss and how to get you back.`,
      })
      .then(() => {
        console.log("Email sent");
      })
      .catch((error) => {
        console.error(error);
      });
};

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
};
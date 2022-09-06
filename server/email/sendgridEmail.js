const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

function sendEmail(firstName, email) {
  const message = {
    to: `${email}`,
    from: {
      name: "CRAZY PICASSO",
      email: "crazy.picasso.master@gmail.com",
    },
    subject: "Welcome to Crazy Picasso!",
    html: `<h1 style="text-align:center">${firstName}, welcome to Crazy Picasso!</h1><br>
    <br><h2 style="text-align:center">You're now an official picasso wannabe artist!</h2><br><h3 style="text-align:center">Very soon, you will be competing against other players with your drawing skills!</h3><br>
    <h3 style="text-align:center">Hope you enjoy the game and we'll see you soon!</h3><br>
    <h3 style="text-align:center">Happy Drawing!</h3>
    <br>
    <br>
    <h4 style="text-align:center">Crazy Picasso Master</h4>`,
  };

  sgMail
    .send(message)
    .then((response) => console.log("Email Sent!"))
    .catch((error) => console.log(error.message));
}

module.exports = { sendEmail };

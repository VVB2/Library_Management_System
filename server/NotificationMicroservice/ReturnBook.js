import nodemailer from 'nodemailer';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass, // generated ethereal password
    },
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./Email Templates/Return Book'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./Email Templates/Return Book'),
    extName: ".handlebars",
  }

  transporter.use('compile', hbs(handlebarOptions));

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "201903004.vinodbvv@student.xavier.ac.in", // list of receivers
    subject: "Hello ✔", // Subject line
    template: 'bookReturnMail',
    context: {
        username: 'Vinod Vaman Bhat',
        book: 'Lorem Ipsum',
        date: '19/12/2022',
        no_of_days: '2',
    },
    attachments: [{
        filename: 'logo.jpeg',
        path: `${path.resolve()}/Email Templates/Return Book/images/logo.jpeg`,
        cid: 'logo'
    },{
        filename: 'rounder-dwn.png',
        path: `${path.resolve()}/Email Templates/Return Book/images/rounder-dwn.png`,
        cid: 'rounder-dwn'
    },{
        filename: 'rounder-up.png',
        path: `${path.resolve()}/Email Templates/Return Book/images/rounder-up.png`,
        cid: 'rounder-up'
    },{
        filename: 'divider.png',
        path: `${path.resolve()}/Email Templates/Return Book/images/divider.png`,
        cid: 'divider'
    },{
        filename: 'facebook2x.png',
        path: `${path.resolve()}/Email Templates/Return Book/images/facebook2x.png`,
        cid: 'facebook'
    },{
        filename: 'googleplus2x.png',
        path: `${path.resolve()}/Email Templates/Return Book/images/googleplus2x.png`,
        cid: 'googleplus'
    },{
        filename: 'twitter2x.png',
        path: `${path.resolve()}/Email Templates/Return Book/images/twitter2x.png`,
        cid: 'twitter'
    }]
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
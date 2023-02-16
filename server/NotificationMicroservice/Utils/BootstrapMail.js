import nodemailer from 'nodemailer';
import path from 'path';
import hbs from 'nodemailer-express-handlebars';

/**
 * 
 * @param {String} template - Contains information about which Email template to use
 * @param {Object} context - Contains all the dynamic details of the email  
 * @param {String} email - The receivers email address
 * @param {String} subject - The subject of the email
 */
export const bootstrapMail = async (template, context, email, subject) => {
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASSWORD
    }
  });

  const handlebarOptions = {
    viewEngine: {
      extName: ".handlebars",
      partialsDir: path.resolve('./Email Templates'),
      defaultLayout: false,
    },
    viewPath: path.resolve('./Email Templates'),
    extName: ".handlebars",
  }

  transporter.use('compile', hbs(handlebarOptions));

  await transporter.sendMail({
    from: '"Knowza.io" <knowza.io.help@gmail.com>', 
    to: email,
    subject: subject,
    template,
    context,
    attachments: [{
        filename: 'logo.jpeg',
        path: `${path.resolve()}/Email Templates/images/logo.jpeg`,
        cid: 'logo'
    },{
        filename: 'rounder-dwn.png',
        path: `${path.resolve()}/Email Templates/images/rounder-dwn.png`,
        cid: 'rounder-dwn'
    },{
        filename: 'rounder-up.png',
        path: `${path.resolve()}/Email Templates/images/rounder-up.png`,
        cid: 'rounder-up'
    },{
        filename: 'divider.png',
        path: `${path.resolve()}/Email Templates/images/divider.png`,
        cid: 'divider'
    },{
        filename: 'facebook2x.png',
        path: `${path.resolve()}/Email Templates/images/facebook2x.png`,
        cid: 'facebook'
    },{
        filename: 'googleplus2x.png',
        path: `${path.resolve()}/Email Templates/images/googleplus2x.png`,
        cid: 'googleplus'
    },{
        filename: 'twitter2x.png',
        path: `${path.resolve()}/Email Templates/images/twitter2x.png`,
        cid: 'twitter'
    },{
        filename: 'lock5.png',
        path: `${path.resolve()}/Email Templates/images/lock5.png`,
        cid: 'lock'
    }]
  });
}
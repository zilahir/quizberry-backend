require('dotenv').config();
const nodemailer = require('nodemailer');
const environment = process.env;

module.exports.SMTPTransport = nodemailer.createTransport({
    host: process.env.SMTP_SERVICE_HOST,
    port: process.env.SMTP_SERVICE_PORT,
    secure: true,
    debug: true,
    auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_USER_PASSWORD
    }
});

const handlebarOptions = {
    viewEngine: {
      extName: '.hbs',
      partialsDir: 'views',
      layoutsDir: 'views',
      defaultLayout: 'email/forgotten_pw.hbs',
    },
    viewPath: 'views/email/',
    extName: '.hbs',
  };

module.exports.ViewOption = (transport, hbs) => {
    transport.use('compile', hbs(handlebarOptions));
}
const MailConfig = require('../services/email');
const hbs = require('nodemailer-express-handlebars');
const smtpTransport = MailConfig.SMTPTransport;

exports.routesConfig = function (app) { 
  app.post('/email/password', (req, res, next) => {
    MailConfig.ViewOption(smtpTransport,hbs);
    const recoveryObject = {
      token: req.body.token,
      slug: req.body.slug
    }
    const HelperOptions = {
      from: '"prompter.me@noreply" <info@prompter.me>',
      to: req.body.username,
      subject: 'demo',
      template: 'forgotten_pw',
      context: {
        slug: recoveryObject.slug,
        token: recoveryObject.token,
      }
    };
    smtpTransport.sendMail(HelperOptions, (error,info) => {
      if(error) {
        console.log(error);
        res.json(error);
      }
      res.json({
        isSuccess: true,
        ...info,
      })
    });
  });
 }
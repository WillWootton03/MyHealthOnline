const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.APP_MAILER_HOST,
    port: process.env.APP_MAILER_PORT,
    secure: false,                                  // For development only
    auth: {
        user: process.env.APP_MAILER,
        pass: process.env.GOOGLE_APP_PASSWORD
    }
});

/*
try {
    await transporter.verify();
    console.log('NodeMailer server is ready to send mail');
} catch (e) {
    console.log('NodeMailer failed to verify', e)
}
*/
module.exports = { transporter };
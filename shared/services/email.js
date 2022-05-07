const nodemailer = require('nodemailer');
const {
  BASE_URL,
  EMAIL_USER,
  EMAIL_PASSWORD
} = require('../../config/keys');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD
      }
    });
  }

  sendMail(oBody) {
    return this.transporter.sendMail({
      from: EMAIL_FROM,
      ...oBody
    });
  }

  passwordReset(email, token) {
    return this.sendMail({
      to: email,
      subject: 'Відновлення пароля',
      html: `
              <h1>Вітаємо, вас!</h1>
              <p>Для успішного завершення відновлення потрібно змінити пароль.</p>
              <p>Посилання для зміни пароля - <a href="${BASE_URL}/reset/${email}/${token}">Відновити пароль</a>.</p>
              <p>Посилання дійсне протягом години.</p>
              <hr />
              <a href="${BASE_URL}">Головна сторінка</a>
            `
    });
  }

  passwordSuccessfullyReset(email) {
    return this.sendMail({
      to: email,
      subject: 'Відновлення пароля пройшло успішно',
      html: `
            <h1>Вітаємо, вас!</h1>
            <p>Відновлення пароля пройшло успішно.</p>
            <hr />
            <a href="${BASE_URL}">Головна сторінка</a>
          `
    });
  }

  userSignUp(email, token) {
    return this.sendMail({
      to: email,
      subject: 'Регістрація нового користувача',
      html: `
              <h1>Вітаємо, вас!</h1>
              <p>Для успішного завершення регістрації потрібно створити пароль.</p>
              <p>Посилання для створення пароля - <a href="${BASE_URL}/signup/${email}/${token}">Створити пароль</a>.</p>
              <p>Посилання дійсне протягом години.</p>
              <hr />
              <a href="${BASE_URL}">Головна сторінка</a>
            `
    });
  }

  userSuccessfullySignUp(email) {
    return this.sendMail({
      to: email,
      subject:
        'Регістрація нового користувача пройшла успішно',
      html: `
              <h1>Вітаємо, вас!</h1>
              <p>Регістрація нового користувача пройшла успішно.</p>
              <p>Ваша електронна адреса для входу в особистий кабінет - ${email}.</p>
              <hr />
              <a href="${BASE_URL}">Головна сторінка</a>
            `
    });
  }
}

const emailService = new EmailService();

module.exports = {
  EmailService,
  emailService
};

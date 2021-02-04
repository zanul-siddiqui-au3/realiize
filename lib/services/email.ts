
import * as Nodemailer from 'nodemailer';
const sgMail = require("@sendgrid/mail");
import { config } from '../config';
import { realpath } from 'fs';
export class EmailService {
  transporter;
  supportEmail;
  sendgridTemplateID;
  constructor() {
    this.transporter = Nodemailer.createTransport(
      {
        service: 'Gmail',
        auth: {
          user: config.GMAIL_USER,
          pass: config.GMAIL_PASS
        }
      }
    );
    sgMail.setApiKey(config.SENDGRID_API_KEY);
  }
  public contactFormSubmission = ({ name, email, message }) => {
    const mailOptions = {
      from: config.SENDGRID_USER_EMAIL,
      to: config.SENDGRID_USER_EMAIL,
      subject: `${name} Contact Form Submission`,
      text: `
      Name: ${name},
      Email: ${email},
      Message: ${message}
      `,
    };
    return sgMail.send(mailOptions);
  };

  public sendPWResetEmail = (email, link) => {
    const mailOptions = {
      from: config.GMAIL_USER,
      to: email,
      subject: "Reset Password",
      text: link,
    };

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(`error: ${error}`);
          reject(error);
        }
        info.status = "Ok";
        resolve(info);
      });
    });
  };

  public sendEmail = async ({ subject, email, data }) => {
    const mailOptions = {
      from: config.SENDGRID_USER_EMAIL,
      to: email,
      subject: subject,
      text: data,
    };

    try {
      await sgMail.send(mailOptions);
    } catch (error) {
      console.log(error.response.body, "Email Error");
    }
  };

  public sendgridTemplate = async ({ data, client }) => {
    const clientFullName = client.fullName
      ? client.fullName.toUpperCase()
      : " User";
    const adminMailRestaurantOptions = {
      from: `${this.supportEmail}`,
      to: `${client.email}`,
      templateId: this.sendgridTemplateID,
      dynamic_template_data: { data },
    };
    try {
      await sgMail.send(adminMailRestaurantOptions);
    } catch (e) {
      console.log(e.response.body, "Email Error");
    }
  };

  public newSubscriptionEmail = (userDetails) => {
    const mailOptions = {
      from: config.SENDGRID_USER_EMAIL,
      to: userDetails.email,
      subject: ` Welcome`,
      text: `
      Hey ${userDetails.fullName},
      Thanks for joining.
      `,
    };
    return sgMail.send(mailOptions);
  };

  public subscriptionRenewalSuccessEmail = (userDetails) => {
    const mailOptions = {
      from: config.SENDGRID_USER_EMAIL,
      to: userDetails.email,
      subject: `${userDetails.fullName} renewal Success`,
      text: `
      Hey ${userDetails.fullName},
      Your  subscription is renewed.
      `,
    };
    return sgMail.send(mailOptions);
  };

  public subscriptionRenewalFailedEmail = (userDetails) => {
    const mailOptions = {
      from: config.SENDGRID_USER_EMAIL,
      to: userDetails.email,
      subject: `${userDetails.fullName} Welcome`,
      text: `
      Hey ${userDetails.fullName},
      We were not able to renew your subscription. Please manually renew it.
      `,
    };
    return sgMail.send(mailOptions);
  };

  

  public sendCancellationEmail = (userDetails) => {
    const mailOptions = {
      from: config.SENDGRID_USER_EMAIL,
      to: userDetails.email,
      subject: `${userDetails.fullName}  Subscription cancelled!`,
      text: `
      Hey ${userDetails.fullName},
      We have successfully cancelled you renewal .
      `,
    };
    return sgMail.send(mailOptions);
  };
}

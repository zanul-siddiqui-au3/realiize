import * as dotenv from 'dotenv';
dotenv.config();

class Config {

  STRIPE_SECRET_KEY: string;
  GMAIL_USER: string;
  GMAIL_PASS: string;
  CONTACT_FORM_TARGET: string;
  MAILCHIMP_KEY: string;
  MAILCHIMP_LIST_ID: string;
  STRIPE_PRICEID : string;
  SENDGRID_API_KEY : string;
  SENDGRID_USER_EMAIL : string;
  UPLOAD_PATH_FRONTEND_BUILD : string;
  SFTP_HOST : string;
  SFTP_PORT : string;
  SFTP_USERNAME : string;
  SFTP_PASSWORD : string;
  constructor() {
    this.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    this.GMAIL_USER = process.env.GMAIL_USER;
    this.GMAIL_PASS = process.env.GMAIL_PASS;
    this.CONTACT_FORM_TARGET = process.env.CONTACT_FORM_TARGET;
    this.MAILCHIMP_KEY = process.env.MAILCHIMP_KEY;
    this.MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
    this.STRIPE_PRICEID = process.env.STRIPE_PRICEID;
    this.SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
    this.SENDGRID_USER_EMAIL = process.env.SENDGRID_USER_EMAIL;
    this.UPLOAD_PATH_FRONTEND_BUILD = process.env.UPLOAD_PATH_FRONTEND_BUILD;
    this.SFTP_HOST = process.env.SFTP_HOST;
    this.SFTP_PORT = process.env.SFTP_PORT;
    this.SFTP_USERNAME = process.env.SFTP_USERNAME;
    this.SFTP_PASSWORD = process.env.SFTP_PASSWORD;
  }

}

export const config = new Config();


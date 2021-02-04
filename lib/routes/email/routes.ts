// NPM Dependencies
import * as express from 'express';
import * as StandardError from 'standard-error';
import * as status from 'http-status';
// Internal Dependencies
import { EmailService } from '../../services/email';


export class EmailRoutes {
  public static async contactForm(
    req: express.Request,
    res: express.Response,
    next
  ) {
    try {
      const { name, email, message } = req.body;
      const emailService = new EmailService();
      await emailService.contactFormSubmission({ name, email, message });
      res.json({ data: "Mail sended successfully" });
    } catch (error) {
      next(error);
    }
  }
}

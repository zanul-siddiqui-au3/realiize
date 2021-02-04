// NPM Dependencies
import * as express from 'express';
import * as StandardError from 'standard-error';
import * as status from 'http-status';
import { MessageService } from '../../services/message';

export class TwilioRoutes {

  public static async send (req: express.Request, res: express.Response, next) {
    try {
        const {number, message} = req.body;
        const messageservice = new MessageService();
        if ( !messageservice.validE164(number) ) {
          throw new StandardError('number must be E164 format!');
        }
        messageservice.sendMessages(number, message)
                      .then((result) => {
                      res.sendStatus(status.OK);
                      })
                      .catch((err) => res.json(err));
      } catch (error) {
      next(error);
    }
  }
}


import * as Twilio from 'twilio';
import * as dotenv from 'dotenv';
dotenv.load();

const twilioNumber = process.env.TWILIONUMBER;
const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;

export class MessageService {
  client;
  constructor() {
    this.client = Twilio(accountSid, authToken);
  }

  public sendMessages = (number, message) => {
    const textContent = {
      body: message,
      to: number,
      from: twilioNumber
    };

    return this.client.messages.create(textContent)
      .then((res) => res);
  }
  // Validate E164 format
  public validE164 = (num) => {
    return /^\+?[1-9]\d{1,14}$/.test(num);
  }
}

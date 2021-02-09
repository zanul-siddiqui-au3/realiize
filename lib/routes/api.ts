import * as express from "express";
import * as status from "http-status";

import { AdminRouter } from "./admin/admin";
import { TestRouter } from "./test";
import { AuthRouter } from "./auth";
// import { PasswordRouter } from './password';

import { PaymentRouter } from "./payment";
import { TwilioRouter } from "./twilio";
import { Middleware } from "../services/middleware";
import { EmailRouter } from "./email";
import { ChatRouter } from "./chat";
import { FileRouter } from "./file";
import { ReviewRouter } from "./review";
import { UserRouter } from "./user";
import { AwsRouter } from "./aws";
const middleware = new Middleware();

export const api = express.Router();
api.use(middleware.jwtDecoder);

api.use("/admin", new AdminRouter().router);
api.use("/test", new TestRouter().router);

// api.use('/password', new PasswordRouter().router);

api.use("/auth", new AuthRouter().router);
api.use("/payment", new PaymentRouter().router);
api.use("/twilio", new TwilioRouter().router);
api.use("/email", new EmailRouter().router);
api.use("/chat", new ChatRouter().router);
api.use("/file", new FileRouter().router);
api.use("/review", new ReviewRouter().router);
api.use("/user", new UserRouter().router);
api.use("/aws", new AwsRouter().router);

api.use((err, req, res, next) => {
  console.log(err);
  res.status(err.code || status.INTERNAL_SERVER_ERROR).send(err);
});

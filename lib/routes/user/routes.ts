// NPM Dependencies
import * as express from "express";
import * as status from "http-status";
import * as StandardError from "standard-error";
import * as bcrypt from "bcrypt";
import * as jwt from "jwt-simple";
import * as jsonwt from "jsonwebtoken";
import { EmailService } from "../../services/email";
import * as dotenv from "dotenv";
dotenv.load();
// Internal Dependencies
import { User } from "../../db";
// Helpers
import {
  audioFromVideo,
  getJwtPayload,
  getTransciptFromVideo,
  uploadToGcpCloud,
} from "./helpers";
import { AwsHelpers } from "../aws/helpers";

export class UserRoutes {
  static JWT_SECRET = process.env.JWT_SECRET || "i am a tea pot";
  public static async sendResetEmail(
    req: express.Request,
    res: express.Response,
    next
  ) {
    try {
      const emailService = new EmailService();
      const email = req.body.email;

      if (!email) {
        throw new StandardError({
          message: "Email is requried ",
          code: status.UNPROCESSABLE_ENTITY,
        });
      }

      const user = await User.findOne({ email });

      if (!user) {
        throw new StandardError({
          message: "Invalid email ",
          code: status.CONFLICT,
        });
      }

      const host = `${req.protocol}://${process.env.HOST}`;

      const link = `${host}/api/user/reset-password/`;
      const token = jsonwt.sign(
        { exp: Math.floor(Date.now() / 1000) + 60 * 60, email_id: email },
        UserRoutes.JWT_SECRET
      );
      const callbackUrl = `<p>Click <a href="${link}${token}">here</a> to reset your password</p>`;
      const result = await emailService.sendPWResetEmail(email, callbackUrl);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
  public static async resetPassword(
    req: express.Request,
    res: express.Response,
    next
  ) {
    try {
      const host = `${req.protocol}://${process.env.HOST}`;
      const token = req.params.token;
      const decoded = await jsonwt.verify(token, UserRoutes.JWT_SECRET);
      if (decoded) {
        const email = decoded.email_id;
        res.redirect(301, `${host}/reset?email=${email}&token=${token}`);
      }
    } catch (error) {
      next(error);
    }
  }
  public static async updatePassword(
    req: express.Request,
    res: express.Response,
    next
  ) {
    try {
      const { email, password, token } = req.body;

      if (!email) {
        throw new StandardError({
          message: "Email is required",
          code: status.UNPROCESSABLE_ENTITY,
        });
      }

      if (!password) {
        throw new StandardError({
          message: "Password is required",
          code: status.UNPROCESSABLE_ENTITY,
        });
      }

      const decoded = await jsonwt.verify(token, UserRoutes.JWT_SECRET);
      if (decoded) {
        const decodedemail = decoded.email_id;
        if (decodedemail === email) {
          const existingUser = await User.findOne({ email });
          if (!existingUser) {
            throw new StandardError({
              message: "Email is not registerd",
              code: status.CONFLICT,
            });
          }
          const hashedPassword = await bcrypt.hash(password, 8);
          const user = await User.update(
            { email },
            { password: hashedPassword },
            { new: true, context: "query" }
          );
          if (user) {
            res.json(existingUser);
          }
        } else {
          throw new StandardError({
            message: "Email is not valid",
            code: status.CONFLICT,
          });
        }
      } else {
        throw new StandardError({
          message: "Email is not found",
          code: status.CONFLICT,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  public static async changePassword(req, res, next) {
    try {
      const { currentPassword, newPassword } = req.body.passwordDetails;
      const match = await bcrypt.compare(currentPassword, req.user.password);
      if (!match) {
        throw new StandardError({
          message: "Invalid password",
          code: status.CONFLICT,
        });
      } else {
        const user = await User.findById(req.user._id);
        const hashedPassword = await bcrypt.hash(newPassword, 8);
        user.password = hashedPassword;
        await user.save();
        res.json({
          token: jwt.encode(getJwtPayload(user), UserRoutes.JWT_SECRET),
          user,
        });
      }
    } catch (error) {
      next(error);
    }
  }

  public static async getTransScript(req, res, next) {
    try {
      const { fileData, fileName } = req.body;
      const keyUrl = await AwsHelpers.getVideoSignedUrl(fileData);
      const audioFileName = await audioFromVideo({
        keyUrl,
        fileName,
      });
      const fileDetails = await uploadToGcpCloud(audioFileName);
      const uploadAudioLink = `gs://${fileDetails[0]["metadata"]["bucket"]}/${fileDetails[0]["metadata"]["name"]}`;
      const data = await getTransciptFromVideo(uploadAudioLink, audioFileName);
      console.log(data);
      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  public static async me(req, res, next) {
    try {
      if (!req.user) {
        res.sendStatus(401);
      } else {
        res.json(req.user);
      }
    } catch (error) {
      next(error);
    }
  }

  public static async unsubscribe(req, res, next) {
    try {
      const id = req.params.id;
      const user = await User.findByIdAndUpdate(id, {
        subscribedToNewsletter: false,
      });
      // await mailchimpService.unregisterUser(user);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

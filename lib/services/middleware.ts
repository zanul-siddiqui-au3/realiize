import * as status from 'http-status';
import * as StandardError from 'standard-error';
import * as jwt from 'jwt-simple';
import { User } from '../db';

export class Middleware {
  JWT_SECRET: string;
  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'i am a tea pot';
  }

  public requireLogin = (req, res, next) => {
    if (!req.user) {
      throw new StandardError({
        message: 'Login Required',
        code: status.UNAUTHORIZED
      });
    }
    next();
  }

  public jwtDecoder = async (req, res, next) => {
    try {
      const authz = req.headers.authorization;
      if (!authz) {
        return next();
      }

      const decoded = jwt.decode(authz, this.JWT_SECRET);

      if (!decoded || !decoded.valid) {
        throw new StandardError({
          message: 'Invalid Token',
          code: status.BAD_REQUEST
        });
      }

      const user = await User.findById(decoded.id);

      if (!user) {
        throw new StandardError({
          message: 'Invalid Token',
          code: status.BAD_REQUEST
        });
      }

      req.user = user;
      req.token = decoded;
      next();
    } catch (error) {
      next(error);
    }
  }

  public requireAdmin = (req, res, next) => {
    if (!req.user) {
      throw new StandardError({
        message: 'Admin authorization required',
        code: status.FORBIDDEN
      });
    }

    if (!req.user.isAdmin) {
      throw new StandardError({
        message: 'Admin authorization required',
        code: status.FORBIDDEN
      });
    }

    next();
  }
}

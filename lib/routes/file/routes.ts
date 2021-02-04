// NPM Dependencies
import * as express from 'express';
import * as StandardError from 'standard-error';
import * as status from 'http-status';
import { fileService } from './../../services/file';

// Internal Dependencies


export class FileRoutes {
  public static async upload(req, res: express.Response, next) {
    try {
      const file = req.files.file;
      const response = await fileService.uploadToS3(file);
      res.sendStatus(status.OK);
    } catch (error) {
      next(error);
    }
  }
}

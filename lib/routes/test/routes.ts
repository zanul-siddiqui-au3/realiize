
    // NPM Dependencies
    import * as status from 'http-status';
    import * as express from 'express';

    // Internal Dependencies
    import { TestHelpers } from './helpers';
    import { AuthenticatedRequest } from 'interfaces/authenticated-request';

    export class TestRoutes {
    
    public static get = async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
      try {
        const query = req.query;
        const user = req.user._id;
        const data = await TestHelpers.findAll(query);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    }
    public static getOne = async(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
      try {
        const id = req.params.id;
        const data = await TestHelpers.findOne(id);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    }
    public static update = async(req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
      try {
        const id = req.params.id;
        const update = req.body.update;
        const doc = await TestHelpers.findOne(id);
        TestHelpers.authenticate(doc, req.user);
        const data = await TestHelpers.findAndUpdate({ id, update });
        res.json({ data });
      } catch (error) {
        next(error);
      }
    }
    public static create = async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
      try {
        const document = req.body.document;
        const data = await TestHelpers.create(document);
        res.json({ data });
      } catch (error) {
        next(error);
      }
    }
    public static delete = async (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => {
      try {
        const id = req.params.id;
        const doc = await TestHelpers.findOne(id);
        TestHelpers.authenticate(doc, req.user);
        TestHelpers.softDelete(id);
        res.sendStatus(status.OK);
      } catch (error) {
        next(error);
      }
    }
    }
    
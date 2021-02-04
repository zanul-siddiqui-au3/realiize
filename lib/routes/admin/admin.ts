import * as express from 'express';
import * as status from 'http-status';
      import { TestRouter } from './test';
import { adminUsersRouter } from './users';


export class AdminRouter {
  router: express.Router;
  constructor() {
    this.router = express.Router();
      this.router.use('/test', new TestRouter().router);
    this.router.use('/user', new adminUsersRouter().router);
  }
}

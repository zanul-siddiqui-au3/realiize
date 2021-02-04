
    // NPM Deps
    import * as express from 'express';
    import { Middleware } from '../../../services/middleware';

    // Internal Deps
    import { TestRoutes } from './routes';
    const middleware = new Middleware();
    export class TestRouter {
      router: express.Router;
      constructor() {
        this.router = express.Router();
        this.router.use(middleware.requireAdmin);
        this.router
          .get('/', TestRoutes.get)
          .post('/', TestRoutes.create)
        this.router
          .get('/:id', TestRoutes.getOne)
          .put('/:id', TestRoutes.update)
          .delete('/:id', TestRoutes.delete);
      }
    }
    